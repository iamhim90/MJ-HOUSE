const { JSDOM } = require("jsdom");
const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const dom = new JSDOM(html, {
  runScripts: "dangerously",
  resources: "usable",
  url: "file:///C:/FINAL-MJ/MJ-HOUSE/index.html"
});

dom.window.onerror = function(msg, url, line, col, err) {
  console.error("JSDOM Error:", msg, line, col, err);
};

dom.window.console.error = function(...args) {
  console.error("JSDOM console.error:", ...args);
};

dom.window.addEventListener('load', () => {
  console.log("Load event fired!");
  
  // Wait a bit to let loader timeouts trigger
  setTimeout(() => {
     console.log("Loader fadeout should have happened.");
     process.exit(0);
  }, 3000);
});

console.log("JSDOM initialized, waiting for load...");
