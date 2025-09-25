function copyToClipboard() {
    const divContent = document.getElementById('output').innerText;
    
    navigator.clipboard.writeText(divContent)
    .then(() => {
        alert('Content copied to clipboard!');
    })
    .catch(err => {
        console.error('Failed to copy: ', err);
    });
}
