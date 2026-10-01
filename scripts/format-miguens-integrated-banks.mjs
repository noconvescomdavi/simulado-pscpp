import fs from "node:fs";

const files = [
  "data/questions/navegacao-aguas-restritas.json",
  "data/questions/meteorologia-oceanografia.json"
];

for (const path of files) {
  const data = JSON.parse(fs.readFileSync(path, "utf8"));
  fs.writeFileSync(path, JSON.stringify(data, null, 2) + "\n");
  console.log(path, data.questions?.length);
}
