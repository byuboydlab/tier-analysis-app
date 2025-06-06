const inputFileButton = document.getElementById('input_file_button');
const outputFolderButton = document.getElementById('output_folder_button');

inputFileButton.addEventListener('click', async (event) => {
    let path = await window.electronAPI.getFilePath();
});
