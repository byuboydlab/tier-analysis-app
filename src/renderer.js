const inputFileButton = document.getElementById('input_file_button');
const outputFolderButton = document.getElementById('output_folder_button');
const inputFilePath = document.getElementById('input_file');
const outputFolderPath = document.getElementById('output_folder')

inputFileButton.addEventListener('click', async (event) => {
    let path = await window.electronAPI.getFilePath(true);
    inputFilePath.innerText = path;
});

outputFolderButton.addEventListener('click', async (event) => {
    let path = await window.electronAPI.getFilePath(false);
    outputFolderPath.innerText = path;
});
