// alert("Hello from your Chrome extension!")

// $(".feed-header").each(parse);
//
// $(".feed-shared-header").each(parse);

const blacklists = ["follow", "likes", "celebrates", "loves", "commented", "supports", "reacted", "follows", "like", "insightful"]

const spams = new Set()


const parse = (node) => {
    const blacklistsRegEx = `/${blacklists.join("|")}/`;
    const shouldBlackList = $(node).find( ".feed-shared-text-view" ).text().trim().match(blacklistsRegEx);

    if (shouldBlackList && !spams.has(node)) {
        spams.add(node);
        console.log("Logs:: Hiding node with header: ", $(node).find( ".feed-shared-header" ).text().trim() || $(node).text().trim());
        $(node).css({display:"none"});
    }

    const isPromoted =  $(node).find( ".feed-shared-actor" ).text().trim().toLowerCase().match(/promoted/);

    if (isPromoted && !spams.has(node)) {
        spams.add(node);
        console.log("Logs:: Hiding Promoted node with header: ", $(node).find( ".feed-shared-actor__title" ).text().trim());
        $(node).css({display:"none"});
    }
}


const target = document.getElementById("main");

let prevClassState = target.classList.contains('feed-shared-header');

const observer = new MutationObserver(function(mutations) {
    // console.log("Logs:: Observer", mutations.length);
    mutations.forEach(function(mutation) {
        const t = mutation.target;
        // console.log("Logs::", t.nodeName, t.childNodes.length);
        if (t.nodeName === "DIV" && t.childNodes.length > 30) {  // Can be perfected later
            const cards = [];
            // console.log("Logs:: ", t, t.nodeName, t.hasChildNodes(), t.childNodes.length);
            t.childNodes.forEach(n => {
                if (n.nodeName === "DIV") cards.push(n);
            });

            // console.log("Logs::", cards.length, cards);
            cards.forEach(parse);
        }
    });
});


// Configuration of the observer:
const config = {
    subtree: true,
    childList: true
};

// Pass in the target node, as well as the observer options
observer.observe(target, config);

