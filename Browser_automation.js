// node Browser_automation.js --url=https://www.hackerrank.com --config=config.json
// npm init -y
// npm install minimist
// npm install puppeteer-core

let minimist = require('minimist');
let fs = require('fs');
let puppeteer = require('puppeteer');

let args = minimist(process.argv);
let configJSON = fs.readFileSync(args.config, "utf-8");
let configJSO = JSON.parse(configJSON);

// let browserkaPromise = puppeteer.launch({headless:false});
// browserkaPromise.then(function(browser){
//     let pageKaPromise=browser.pages();
//     pageKaPromise.then(function(pages){
//        let responseKaPromise=pages[0].goto(args.url);
//        responseKaPromise.then(function(response){
//           let browserCloseKaPromise=browser.close();
//           browserCloseKaPromise.then(function(){
//             console.log("browser Closed!!");
//           })
//        })
//     })
// })

async function run() {
    let browser = await puppeteer.launch(
        {
            headless: false,
            defaultViewport: null,
            args: [
                '--start-maximized'
            ]
        }
    );
    let pages = await browser.pages();
    let page = pages[0];
    await page.goto(args.url);

    // await page.waitForSelector("a[href='/accounts/login/']");
    // await page.click("a[href='/accounts/login/']");

    // await page.waitForSelector("input[name='login']");
    // await page.type("input[name='login']",configJSO.username,{delay:30});

    // await page.waitForSelector("input[name='password']");
    // await page.type("input[name='password']",configJSO.password,{delay:30});

    // // await page.waitForNavigation({waitUntil:'networkidle0'});

    // // for(let i=0;i<10;i++){
    // //     await page.keyboard.press("Tab");
    // // }
    // await page.waitForSelector("button[data-cy='sign-in-btn']");
    // await page.keyboard.press("Enter");

    await page.waitForSelector("a[href='/access-account/']");
    await page.click("a[href='/access-account/']");

    await page.waitForSelector("a[href='/login/']");
    await page.click("a[href='/login/']");

    await page.waitForSelector("input[name='username']");
    await page.type("input[name='username']", configJSO.username, { delay: 30 });

    await page.waitForSelector("input[name='password']");
    await page.type("input[name='password']", configJSO.password, { delay: 30 });

    await page.waitForSelector("button[data-analytics='LoginPassword']");
    await page.click("button[data-analytics='LoginPassword']");

    await page.waitForSelector("a[href='/contests']");
    await page.click("a[href='/contests']");

    await page.waitForSelector("a[href='/administration/contests/']");
    await page.click("a[href='/administration/contests/']");

    // for counting pages
    // await page.waitForSelector();
    // page.$eval -> select only first element and return string
    // let numpages = await page.$eval("", function (atag) {
    //     let total_pages = parseInt(atag.getAttribute(""));
    //     return total_pages;
    // });
    // for (let i = 1; i <= numpages; i++) {
    //     await handleAllContestPage(page,browser);
    //     if (i < numpages) {
    //         await page.waitForSelector();
    //         await page.click();
    //     }
    // }

    async function handleAllContestPage(page,browser) {
        await page.waitForSelector("a.backbone.block-center");
       // page.$$eval -> select all like allselctor ans give array
        let contesturl = await page.$$eval("a.backbone.block-center", function (atags) {
            let urls = [];
            for (let i = 0; i < atags.length; i++) {
                let url = atags[i].getAttribute("href");
                urls.push(url);
            }
            return urls;
        });

        for (let i = 0; i < contesturl.length; i++) {
            let ctab = await browser.newPage();
            await saveAllPageModeator(ctab, args.url + contesturl[i], configJSO.moderator);
            await page.waitForTimeout(2000);



        }
    }
    async function saveAllPageModeator(ctab, contesturl, moderator) {
        await ctab.bringToFront();
        await ctab.goto(contesturl);
        await ctab.waitForTimeout(3000);

        await ctab.waitForSelector("li[data-tab='moderators']");
        await ctab.click("li[data-tab='moderators']", { delay: 20 });

        await ctab.waitForSelector("input#moderator");
        await ctab.type("input#moderator", moderator, { delay: 20 });

        await ctab.keyboard.press("Enter");
        await ctab.close();
    }

    // await browser.close();
    // console.log("browser Closed!!");
}

run();