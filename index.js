/**
 * @author Goutham Gopal
 */

addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});

// URL to fetch the variants.
const URI = "https://cfw-takehome.developers.workers.dev/api/variants";

/**
 * Function to fetch the variants from the url provided.
 * @param {} url url to fetch the variants from.
 */
async function fetchVariants(url) {
  var response = await fetch(url);
  var jsonResponse = await response.json();
  return jsonResponse["variants"];
}

/**
 * Function to randomize fetch between variants and retrieve data.
 * @param {variants} variants
 */
async function randomizeFetch(variants) {
  var randomOrder = Math.random() > 0.5 ? 1 : 0;

  // document.cookie = "url =" + variants[randomOrder] + ";";
  var response = await fetch(variants[randomOrder]);

  var result = [response, variants[randomOrder]];

  return result;
}

/**
 * Class to prepend the title changes of an HTML element.
 */
class TitleHandler {
  element(element) {
    element.prepend("Goutham Gopal, ");
  }
}

/**
 * Class to edit the description changes of an HTML element.
 */
class BodyHandler {
  element(element) {
    element.replace("Providing link to my github account");
  }
}

/**
 * Class to edit the anchor tag changes of an HTML element.
 */
class ActionHandler {
  element(element) {
    element
      .setInnerContent("github/gouthamgopal")
      .setAttribute("href", "https://github.com/gouthamgopal");
  }
}

/**
 * Function to modify the html data of a given page.
 * @param {response} response  Response from a variant whose data has to be modified.
 */
function rewriteContent(response) {
  var rewriter = new HTMLRewriter();
  const res = rewriter
    .on("title", new TitleHandler())
    .on("h1#title", new TitleHandler())
    .on("p#description", new BodyHandler())
    .on("a#url", new ActionHandler())
    .transform(response);

  return res;
}

/**
 * Respond with hello worker text.
 * @param {Request} request
 */
async function handleRequest(request) {
  // Check for cookie set as returning, if found, re fetch the request.
  // let cookies = request.headers.get("Cookie") || "";
  // if (cookies.includes("returning=true")) {
  //   console.log("From cookie");
  //   // var urlData = cookies.substr(4);
  //   // User has been here before. Just pass request through.
  //   return fetch(request);
  // }

  // Variants will store the two variant url provided by the worker.
  const variants = await fetchVariants(URI);

  // Randomizing the variant used and fetching the data.
  var variantResponse = await randomizeFetch(variants);

  // Utilizing HTMLRewriter to modify the content.
  var rewriteResponse = rewriteContent(variantResponse[0]);

  // Code to set cookie for the url to be re rendered, after first visit.
  // rewriteResponse = new Response(rewriteResponse.body, rewriteResponse);
  // rewriteResponse.headers.set("Set-Cookie", "returning=true");

  return rewriteResponse;
}
