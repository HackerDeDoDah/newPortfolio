// Initialize CodeMirror editors
const htmlEditor = CodeMirror.fromTextArea(document.getElementById('html'), {
    mode: 'htmlmixed',
    theme: 'dracula',
    lineNumbers: true,
    autoCloseTags: true,
    autoCloseBrackets: true,
    matchBrackets: true,
    lineWrapping: true,
    tabSize: 2,
    scrollbarStyle: null,
    keyMap: 'sublime',
    extraKeys: {
        "Shift-Ctrl-1": insertBasicTemplate,
        "Shift-Ctrl-2": insertEmailTemplate
    }
});

const cssEditor = CodeMirror.fromTextArea(document.getElementById('css'), {
    mode: 'css',
    theme: 'dracula',
    lineNumbers: true,
    autoCloseBrackets: true,
    matchBrackets: true,
    lineWrapping: true,
    tabSize: 2,
    scrollbarStyle: null
});

// Menu functionality
const menuButton = document.querySelector('.menu-button');
const menuDropdown = document.querySelector('.menu-dropdown');

menuButton.addEventListener('click', () => {
    menuDropdown.classList.toggle('active');
});

// Tips functionality
const tipsButton = document.querySelector('.tips-button');
const tipsDropdown = document.querySelector('.tips-dropdown');

tipsButton.addEventListener('click', () => {
    tipsDropdown.classList.toggle('active');
});

// Close dropdowns when clicking outside
document.addEventListener('click', (e) => {
    if (!menuButton.contains(e.target)) {
        menuDropdown.classList.remove('active');
    }
    if (!tipsButton.contains(e.target) && !tipsDropdown.contains(e.target)) {
        tipsDropdown.classList.remove('active');
    }
});

// Save and Load functionality
document.getElementById('saveButton').addEventListener('click', () => {
    const content = {
        html: htmlEditor.getValue(),
        css: cssEditor.getValue()
    };
    
    const blob = new Blob([JSON.stringify(content)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'editor-content.json';
    document.body.appendChild(a);
    a.click();
    
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    menuDropdown.classList.remove('active');
});

document.getElementById('loadButton').addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.addEventListener('change', (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        
        reader.addEventListener('load', () => {
            try {
                const content = JSON.parse(reader.result);
                htmlEditor.setValue(content.html || '');
                cssEditor.setValue(content.css || '');
                updatePreview();
            } catch (err) {
                alert('Error loading file: Invalid format');
            }
        });
        
        reader.readAsText(file);
    });
    
    input.click();
    menuDropdown.classList.remove('active');
});

// document.getElementById('saveHTMLButton').addEventListener('click', () => {
//     const htmlContent = htmlEditor.getValue();
//     const htmlBlob = new Blob([htmlContent], { type: 'text/html' });
//     const htmlUrl = URL.createObjectURL(htmlBlob);

//     const a = document.createElement('a');
//     a.href = htmlUrl;
//     a.download = 'index.html';
//     document.body.appendChild(a);
//     a.click();

//     document.body.removeChild(a);
//     URL.revokeObjectURL(htmlUrl);
//     menuDropdown.classList.remove('active');
// });

// document.getElementById('saveCSSButton').addEventListener('click', () => {
//     const cssContent = cssEditor.getValue();
//     const cssBlob = new Blob([cssContent], { type: 'text/css' });
//     const cssUrl = URL.createObjectURL(cssBlob);

//     const a = document.createElement('a');
//     a.href = cssUrl;
//     a.download = 'styles.css';
//     document.body.appendChild(a);
//     a.click();

//     document.body.removeChild(a);
//     URL.revokeObjectURL(cssUrl);
//     menuDropdown.classList.remove('active');
// });

// document.getElementById('loadHTMLButton').addEventListener('click', () => {
//     const input = document.createElement('input');
//     input.type = 'file';
//     input.accept = '.html';

//     input.addEventListener('change', (e) => {
//         const file = e.target.files[0];
//         const reader = new FileReader();

//         reader.addEventListener('load', () => {
//             try {
//                 htmlEditor.setValue(reader.result);
//                 updatePreview();
//             } catch (err) {
//                 alert('Error loading file: Invalid format');
//             }
//         });

//         reader.readAsText(file);
//     });

//     input.click();
//     menuDropdown.classList.remove('active');
// });

// document.getElementById('loadCSSButton').addEventListener('click', () => {
//     const input = document.createElement('input');
//     input.type = 'file';
//     input.accept = '.css';

//     input.addEventListener('change', (e) => {
//         const file = e.target.files[0];
//         const reader = new FileReader();

//         reader.addEventListener('load', () => {
//             try {
//                 cssEditor.setValue(reader.result);
//                 updatePreview();
//             } catch (err) {
//                 alert('Error loading file: Invalid format');
//             }
//         });

//         reader.readAsText(file);
//     });

//     input.click();
//     menuDropdown.classList.remove('active');
// });

// Template definitions
const basicTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    
</body>
</html>`;

const emailTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Template</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td style="padding: 20px; text-align: center;">
                <h1>Email Heading</h1>
                <p>Your email content here</p>
            </td>
        </tr>
    </table>
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td style="padding: 20px; text-align: center; font-size: 12px;">
                <p>Footer &copy; 2025</p>
            </td>
        </tr>
    </table>
</body>
</html>`;

// Template insertion functions
function insertBasicTemplate() {
    htmlEditor.setValue(basicTemplate);
    showBothEditors();
    // Position cursor inside the body tag
    htmlEditor.setCursor({line: 8, ch: 4});
}

function insertEmailTemplate() {
    htmlEditor.setValue(emailTemplate);
    showEmailEditor();
    // Position cursor after the email heading
    htmlEditor.setCursor({line: 12, ch: 42});
}

function showEmailEditor() {
    const htmlFolder = document.querySelector('.editor-folder:first-child');
    const cssFolder = document.querySelector('.editor-folder:last-child');
    
    htmlFolder.classList.add('expanded');
    cssFolder.classList.add('hidden');
    cssEditor.setValue('');
    htmlEditor.refresh();
}

function showBothEditors() {
    const htmlFolder = document.querySelector('.editor-folder:first-child');
    const cssFolder = document.querySelector('.editor-folder:last-child');
    
    htmlFolder.classList.remove('expanded');
    cssFolder.classList.remove('hidden');
    htmlEditor.refresh();
    cssEditor.refresh();
}

// Update preview function
function updatePreview() {
    const html = htmlEditor.getValue();
    const css = cssEditor.getValue();
    const previewContent = `
        <!DOCTYPE html>
        <html>
            <head>
                <style>${css}</style>
            </head>
            <body>${html}</body>
        </html>
    `;
    document.getElementById('preview').srcdoc = previewContent;
}

// Event listeners for editor changes
htmlEditor.on('change', updatePreview);
cssEditor.on('change', updatePreview);

// Initialize preview
updatePreview();

// Check if user has already accepted cookies
document.addEventListener('DOMContentLoaded', function() {
    const cookieConsent = document.getElementById('cookie-consent');
    const cookieOverlay = document.getElementById('cookie-overlay');
    const acceptButton = document.getElementById('accept-cookies');

    // Check if user has already accepted cookies
    if (!localStorage.getItem('cookiesAccepted')) {
        cookieConsent.style.display = 'block';
        cookieOverlay.style.display = 'block';
    }

    // Handle accept button click
    acceptButton.addEventListener('click', function() {
        localStorage.setItem('cookiesAccepted', 'true');
        cookieConsent.style.display = 'none';
        cookieOverlay.style.display = 'none';
    });
});