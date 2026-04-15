const arrRefComponents = document.getElementsByTagName("component");

for (const refComponent of arrRefComponents) {
    fetch(`/dev/components/${refComponent.getAttribute("src")}.html`).then((file) => {
        file.text().then((html) => {
            const refHTML = new DOMParser().parseFromString(html, "text/html").body.firstChild;

            refComponent.parentNode.insertBefore(refHTML, refComponent);

            refComponent.remove();
        });
    });
}