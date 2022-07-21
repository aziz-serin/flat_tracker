const puppeteer = require('puppeteer');
const url = "https://www.rightmove.co.uk/property-to-rent/find.html?locationIdentifier=REGION%5E219&maxBedrooms=1&minBedrooms=1&propertyTypes=&mustHave=&dontShow=&furnishTypes=furnished&keywords=";

module.exports = async function(){
    let apartments;
    try{
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        const navigationPromise = page.waitForNavigation();

        await page.goto(url);
        await page.setViewport({width: 1440, height: 3440});
        await navigationPromise;
        await page.waitForSelector("#l-searchResults");
        apartments = await page.$$eval("#l-searchResults", listings => {
            let query = listings.map(listing => listing.innerText)[0];
            // I am sure below this part can be done in a better and more clear way
            let strip_contact = query.replaceAll("Contact", "");
            let strip_save = strip_contact.replaceAll("Save", "");
            let strip_stick = strip_save.replaceAll("|", "");
            let strip_call_rate = strip_stick.replaceAll("Local call rate", "");
            // The below regexes removes all the unnecessary stuff from the returned text
            let regex1 = new RegExp("1\/.", 'g')
            let after_regex1 = strip_call_rate.replaceAll(regex1, "");
            let regex2 = new RegExp("Property image 1 of [0-9]", 'g');
            let after_regex2 = after_regex1.replaceAll(regex2, "");
            let regex3 = new RegExp("showing Photo [0-9]", 'g');
            let after_regex3 = after_regex2.replaceAll(regex3, "");
            // Note that this last regex also removes the last chars of phone numbers, so do not use them.
            let regex4 = new RegExp("[0-9]\n", 'g');
            return after_regex3.replaceAll(regex4, "");
        });
        //await page.screenshot({path: 'screenshot.png'});
        console.log("Fetched the apartments!");
        await browser.close();

    }catch (e){
        console.log("Error:");
        console.log(e.message);
    }
    return apartments;
}