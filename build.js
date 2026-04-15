const fs = require("fs");
const path = require("path");

const STR_DOSSIER_SOURCE = "./dev/";
const STR_DATE = new Date().toISOString().replace("T", "_").replace(/:/g, "").split(".")[0];

const arrStrCheminsFichiers = fs
    .readdirSync(STR_DOSSIER_SOURCE, { recursive: true, withFileTypes: true })
    .filter((item) => item.isFile())
    .map((item) => {
        return item.path ? path.join(item.path, item.name).replace(STR_DOSSIER_SOURCE, "") : item.name;
    });

for (const strCheminFichier of arrStrCheminsFichiers) {
    try {
        if (strCheminFichier.includes("componantSupport.js")) continue;
        if (strCheminFichier.includes("dev/componants/")) continue;

        const strContenuFichier = fs.readFileSync(strCheminFichier, "utf8");
        const strContenuFichierSansScript = strContenuFichier.replace(/<script.* src=".*componantSupport\.js".*>.*<\/script>/g, "");
        const strCheminFichierBuild = strCheminFichier.replace("dev/", `build/${STR_DATE}/`);
        const strCheminDossierBuild = path.dirname(strCheminFichierBuild);

        let strContenuFichierPreBuild = strContenuFichierSansScript;

        for (const arrMatch of strContenuFichierPreBuild.matchAll(/<componant.* src="(.*)".*>.*<\/componant>/g)) {
            const strCheminComponant = `dev/componants/${arrMatch[1]}.html`;
            const strContenuComponant = fs.readFileSync(strCheminComponant, "utf8");
            strContenuFichierPreBuild = strContenuFichierPreBuild.replace(arrMatch[0], strContenuComponant);
        }

        const strContenuFichierBuild = strContenuFichierPreBuild;

        fs.mkdirSync(strCheminDossierBuild, { recursive: true });
        fs.writeFileSync(strCheminFichierBuild, strContenuFichierBuild, "utf8");
    } catch (error) {
        console.error(error);
    }
}