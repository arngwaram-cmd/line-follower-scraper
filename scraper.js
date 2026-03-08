const { chromium } = require('playwright');

const companies = [
    { name: 'bTaskee', url: 'https://page.line.me/639ubqnq' },
    { name: 'Bluuu', url: 'https://page.line.me/bluuu' }, // ตัวอย่างที่ชอบติด QR
    // เพิ่มบริษัทอื่นๆ ตรงนี้
];

async function getFollowers() {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    let results = "📊 สรุปยอดผู้ติดตาม LINE OA\n\n";

    for (const comp of companies) {
        try {
            await page.goto(comp.url);
            // พยายามดึงเลข Friends จากหน้า LINE ตรงๆ
            const followers = await page.locator('span:has-text("Friends")').innerText();
            results += `✅ ${comp.name}: ${followers}\n`;
        } catch (e) {
            // 💡 ถ้าติดหน้า QR ให้สลับไปหาใน Google แทน (แผนสำรอง)
            await page.goto(`https://www.google.com/search?q=site:page.line.me+"${comp.name}"`);
            const googleText = await page.locator('div.VwiC3b').first().innerText();
            results += `🔍 ${comp.name}: (ดึงจาก Google) ${googleText.substring(0, 30)}...\n`;
        }
    }

    console.log(results);
    // ตรงนี้สามารถเพิ่ม Code ส่งเข้า LINE Notify หรือ Discord ได้ครับ
    await browser.close();
}

getFollowers();
