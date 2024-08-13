document.addEventListener('DOMContentLoaded', function () {
    const languageSelect = document.getElementById('languageSelect');
    const contentInput = document.getElementById('contentInput');
    const translateButton = document.getElementById('translateButton');
    const translationResult = document.getElementById('translationResult');

    translateButton.addEventListener('click', () => {
        const selectedLanguage = languageSelect.value; // getting the selected translation direction
        const content = contentInput.value;

        // making an AJAX request to the server for translation with the selected translation direction
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `/translate/${selectedLanguage}?content=${content}`);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                translationResult.textContent = response.translation;
            }
        };
        xhr.send();
    });
});
