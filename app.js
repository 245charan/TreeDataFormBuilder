// Main Application Logic
document.addEventListener('DOMContentLoaded', function() {
    // Application State
    const appState = {
        courseId: '',
        courseName: '',
        facultyEmail: '',
        unitCount: 0,
        unitData: [], // {unitIndex, unitName}
        folderData: [], // {unitIndex, folderIndex, folderName}
        fileData: [], // {unitIndex, folderIndex, fileIndex, fileName, fileType}
        selectedIssues: [], // {targetType, unitIndex, folderIndex, fileIndex, issueId, issueName, notes}
        currentTargetType: '', // 'unit', 'folder', or 'file'
        currentUnitIndex: 0,
        currentFolderIndex: 0,
        currentFileIndex: 0,
        currentTargetName: ''
    };

    // DOM Elements - Home Screen
    const homeScreen = document.getElementById('homeScreen');
    const courseIdInput = document.getElementById('courseId');
    const courseNameInput = document.getElementById('courseName');
    const facultyEmailInput = document.getElementById('facultyEmail');
    const startBuildingBtn = document.getElementById('startBuildingBtn');
    const savedDraftsList = document.getElementById('savedDraftsList');
    const clearAllDraftsBtn = document.getElementById('clearAllDraftsBtn');

    // DOM Elements - Builder Screen
    const builderScreen = document.getElementById('builderScreen');
    const backToHomeBtn = document.getElementById('backToHomeBtn');
    const courseHeader = document.getElementById('courseHeader');
    const decreaseUnitBtn = document.getElementById('decreaseUnitBtn');
    const unitCount = document.getElementById('unitCount');
    const increaseUnitBtn = document.getElementById('increaseUnitBtn');
    const unitsContainer = document.getElementById('unitsContainer');
    const saveProgressBtn = document.getElementById('saveProgressBtn');
    const reviewBtn = document.getElementById('reviewBtn');

    // DOM Elements - Issues Screen
    const issuesScreen = document.getElementById('issuesScreen');
    const backToBuilderBtn = document.getElementById('backToBuilderBtn');
    const issueTargetHeader = document.getElementById('issueTargetHeader');
    const issuesList = document.getElementById('issuesList');
    const issuesSearchInput = document.getElementById('issuesSearchInput');
    const doneSelectingIssuesBtn = document.getElementById('doneSelectingIssuesBtn');

    // DOM Elements - Review Screen
    const reviewScreen = document.getElementById('reviewScreen');
    const backToBuilderFromReviewBtn = document.getElementById('backToBuilderFromReviewBtn');
    const reviewHeader = document.getElementById('reviewHeader');
    const totalIssuesCount = document.getElementById('totalIssuesCount');
    const selectedIssuesList = document.getElementById('selectedIssuesList');
    const submitIssuesBtn = document.getElementById('submitIssuesBtn');

    // DOM Elements - Confirmation Screen
    const confirmationScreen = document.getElementById('confirmationScreen');
    const confirmationMessage = document.getElementById('confirmationMessage');
    const sendEmailBtn = document.getElementById('sendEmailBtn');
    const returnHomeBtn = document.getElementById('returnHomeBtn');

    // DOM Elements - Email Modal
    const emailModal = document.getElementById('emailModal');
    const emailSubject = document.getElementById('emailSubject');
    const emailBody = document.getElementById('emailBody');
    const closeModalBtn = document.querySelector('.close');
    const cancelEmailBtn = document.getElementById('cancelEmailBtn');
    const sendEmailConfirmBtn = document.getElementById('sendEmailConfirmBtn');

    // Templates
    const unitTemplate = document.getElementById('unitTemplate');
    const folderTemplate = document.getElementById('folderTemplate');
    const fileTemplate = document.getElementById('fileTemplate');
    const issueTemplate = document.getElementById('issueTemplate');
    const selectedIssueTemplate = document.getElementById('selectedIssueTemplate');
    const savedDraftTemplate = document.getElementById('savedDraftTemplate');

    // Initialize the application
    initApp();

    // Event Listeners - Home Screen
    startBuildingBtn.addEventListener('click', startBuilding);
    clearAllDraftsBtn.addEventListener('click', clearAllDrafts);

    // Event Listeners - Builder Screen
    backToHomeBtn.addEventListener('click', navigateToHome);
    decreaseUnitBtn.addEventListener('click', decreaseUnit);
    increaseUnitBtn.addEventListener('click', increaseUnit);
    saveProgressBtn.addEventListener('click', saveProgress);
    reviewBtn.addEventListener('click', reviewIssues);

    // Event Listeners - Issues Screen
    backToBuilderBtn.addEventListener('click', navigateToBuilder);
    doneSelectingIssuesBtn.addEventListener('click', doneSelectingIssues);
    issuesSearchInput.addEventListener('input', filterIssues);

    // Event Listeners - Review Screen
    backToBuilderFromReviewBtn.addEventListener('click', navigateToBuilder);
    submitIssuesBtn.addEventListener('click', submitIssues);

    // Event Listeners - Confirmation Screen
    sendEmailBtn.addEventListener('click', showEmailModal);
    returnHomeBtn.addEventListener('click', resetAndNavigateToHome);

    // Event Listeners - Email Modal
    closeModalBtn.addEventListener('click', closeEmailModal);
    cancelEmailBtn.addEventListener('click', closeEmailModal);
    sendEmailConfirmBtn.addEventListener('click', sendEmail);

    // Initialize the application
    function initApp() {
        // Load saved drafts
        loadSavedDrafts();
        
        // Add field validations
        addFieldValidations();
    }

    // Add field validations
    function addFieldValidations() {
        // Course ID validation
        courseIdInput.addEventListener('input', function() {
            validateField(this, this.value.trim() !== '', 'Course ID is required');
        });

        // Course Name validation
        courseNameInput.addEventListener('input', function() {
            validateField(this, this.value.trim() !== '', 'Course Name is required');
        });

        // Faculty Email validation
        facultyEmailInput.addEventListener('input', function() {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            validateField(this, emailRegex.test(this.value.trim()), 'Valid email is required');
        });
    }

    // Validate a field
    function validateField(field, isValid, errorMessage) {
        if (!isValid) {
            field.classList.add('invalid');
            
            // Create or update error message
            let errorElement = field.parentElement.querySelector('.error-message');
            if (!errorElement) {
                errorElement = document.createElement('div');
                errorElement.className = 'error-message';
                errorElement.style.color = 'red';
                errorElement.style.fontSize = '12px';
                errorElement.style.marginTop = '5px';
                field.parentElement.appendChild(errorElement);
            }
            errorElement.textContent = errorMessage;
        } else {
            field.classList.remove('invalid');
            
            // Remove error message if exists
            const errorElement = field.parentElement.querySelector('.error-message');
            if (errorElement) {
                errorElement.remove();
            }
        }
        
        return isValid;
    }

    // Start building course structure
    function startBuilding() {
        // Validate required fields
        const isCourseIdValid = validateField(courseIdInput, courseIdInput.value.trim() !== '', 'Course ID is required');
        const isCourseNameValid = validateField(courseNameInput, courseNameInput.value.trim() !== '', 'Course Name is required');
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isFacultyEmailValid = validateField(facultyEmailInput, emailRegex.test(facultyEmailInput.value.trim()), 'Valid email is required');
        
        if (!isCourseIdValid || !isCourseNameValid || !isFacultyEmailValid) {
            return;
        }
        
        // Update app state
        appState.courseId = courseIdInput.value.trim();
        appState.courseName = courseNameInput.value.trim();
        appState.facultyEmail = facultyEmailInput.value.trim();
        
        // Update UI
        courseHeader.textContent = `Building Structure for: ${appState.courseName} (${appState.courseId})`;
        
        // Navigate to builder screen
        navigateToScreen(builderScreen);
    }

    // Decrease unit count
    function decreaseUnit() {
        if (appState.unitCount > 0) {
            appState.unitCount--;
            updateUnitCount();
            
            // Remove the last unit from the DOM
            const unitElements = unitsContainer.querySelectorAll('.unit-item');
            if (unitElements.length > 0) {
                unitsContainer.removeChild(unitElements[unitElements.length - 1]);
            }
            
            // Update app state
            appState.unitData = appState.unitData.filter(unit => unit.unitIndex < appState.unitCount);
            appState.folderData = appState.folderData.filter(folder => folder.unitIndex < appState.unitCount);
            appState.fileData = appState.fileData.filter(file => file.unitIndex < appState.unitCount);
            appState.selectedIssues = appState.selectedIssues.filter(issue => issue.unitIndex < appState.unitCount);
        }
    }

    // Increase unit count
    function increaseUnit() {
        appState.unitCount++;
        updateUnitCount();
        
        // Add a new unit to the DOM
        addUnitToDOM(appState.unitCount - 1);
        
        // Update app state
        appState.unitData.push({
            unitIndex: appState.unitCount - 1,
            unitName: ''
        });
    }

    // Update unit count display
    function updateUnitCount() {
        unitCount.textContent = appState.unitCount;
    }

    // Add a unit to the DOM
    function addUnitToDOM(unitIndex) {
        // Clone the unit template
        const unitNode = document.importNode(unitTemplate.content, true);
        const unitItem = unitNode.querySelector('.unit-item');
        
        // Set unit index
        unitItem.dataset.unitIndex = unitIndex;
        
        // Get unit name input
        const unitNameInput = unitItem.querySelector('.unit-name');
        
        // Set unit name if exists in app state
        const existingUnit = appState.unitData.find(unit => unit.unitIndex === unitIndex);
        if (existingUnit) {
            unitNameInput.value = existingUnit.unitName;
        }
        
        // Add event listener for unit name input
        unitNameInput.addEventListener('input', function() {
            const unitIndex = parseInt(unitItem.dataset.unitIndex);
            const existingUnitIndex = appState.unitData.findIndex(unit => unit.unitIndex === unitIndex);
            
            if (existingUnitIndex !== -1) {
                appState.unitData[existingUnitIndex].unitName = this.value;
            } else {
                appState.unitData.push({
                    unitIndex: unitIndex,
                    unitName: this.value
                });
            }
        });
        
        // Add event listener for check issues button
        const checkIssuesBtn = unitItem.querySelector('.check-issues-btn');
        checkIssuesBtn.addEventListener('click', function() {
            const unitIndex = parseInt(unitItem.dataset.unitIndex);
            const unitName = unitNameInput.value;
            
            // Validate unit name
            if (!unitName.trim()) {
                alert('Please enter a unit name before checking issues.');
                return;
            }
            
            // Update app state
            appState.currentTargetType = 'unit';
            appState.currentUnitIndex = unitIndex;
            appState.currentTargetName = unitName;
            
            // Update UI
            issueTargetHeader.textContent = `Select Issues for Unit: ${unitName}`;
            
            // Populate issues list
            populateIssuesList();
            
            // Navigate to issues screen
            navigateToScreen(issuesScreen);
        });
        
        // Add event listener for toggle button
        const toggleBtn = unitItem.querySelector('.toggle-btn');
        const unitContent = unitItem.querySelector('.unit-content');
        
        toggleBtn.addEventListener('click', function() {
            unitContent.classList.toggle('open');
            const icon = this.querySelector('i');
            icon.classList.toggle('fa-chevron-down');
            icon.classList.toggle('fa-chevron-up');
        });
        
        // Add event listeners for folder controls
        const decreaseFolderBtn = unitItem.querySelector('.decrease-folder-btn');
        const folderCount = unitItem.querySelector('.folder-count');
        const increaseFolderBtn = unitItem.querySelector('.increase-folder-btn');
        const foldersContainer = unitItem.querySelector('.folders-container');
        
        // Initialize folder count
        const currentFolderCount = appState.folderData.filter(folder => folder.unitIndex === unitIndex).length;
        folderCount.textContent = currentFolderCount;
        
        // Add existing folders
        for (let i = 0; i < currentFolderCount; i++) {
            addFolderToDOM(unitIndex, i, foldersContainer);
        }
        
        // Add event listeners for folder buttons
        decreaseFolderBtn.addEventListener('click', function() {
            const unitIndex = parseInt(unitItem.dataset.unitIndex);
            const currentFolderCount = parseInt(folderCount.textContent);
            
            if (currentFolderCount > 0) {
                // Update folder count
                folderCount.textContent = currentFolderCount - 1;
                
                // Remove the last folder from the DOM
                const folderElements = foldersContainer.querySelectorAll('.folder-item');
                if (folderElements.length > 0) {
                    foldersContainer.removeChild(folderElements[folderElements.length - 1]);
                }
                
                // Update app state
                appState.folderData = appState.folderData.filter(folder => 
                    !(folder.unitIndex === unitIndex && folder.folderIndex === currentFolderCount - 1)
                );
                appState.fileData = appState.fileData.filter(file => 
                    !(file.unitIndex === unitIndex && file.folderIndex === currentFolderCount - 1)
                );
                appState.selectedIssues = appState.selectedIssues.filter(issue => 
                    !(issue.unitIndex === unitIndex && issue.folderIndex === currentFolderCount - 1)
                );
            }
        });
        
        increaseFolderBtn.addEventListener('click', function() {
            const unitIndex = parseInt(unitItem.dataset.unitIndex);
            const currentFolderCount = parseInt(folderCount.textContent);
            
            // Update folder count
            folderCount.textContent = currentFolderCount + 1;
            
            // Add a new folder to the DOM
            addFolderToDOM(unitIndex, currentFolderCount, foldersContainer);
            
            // Update app state
            appState.folderData.push({
                unitIndex: unitIndex,
                folderIndex: currentFolderCount,
                folderName: ''
            });
        });
        
        // Add the unit to the container
        unitsContainer.appendChild(unitItem);
    }

    // Add a folder to the DOM
    function addFolderToDOM(unitIndex, folderIndex, foldersContainer) {
        // Clone the folder template
        const folderNode = document.importNode(folderTemplate.content, true);
        const folderItem = folderNode.querySelector('.folder-item');
        
        // Set folder indices
        folderItem.dataset.unitIndex = unitIndex;
        folderItem.dataset.folderIndex = folderIndex;
        
        // Get folder name input
        const folderNameInput = folderItem.querySelector('.folder-name');
        
        // Set folder name if exists in app state
        const existingFolder = appState.folderData.find(folder => 
            folder.unitIndex === unitIndex && folder.folderIndex === folderIndex
        );
        if (existingFolder) {
            folderNameInput.value = existingFolder.folderName;
        }
        
        // Add event listener for folder name input
        folderNameInput.addEventListener('input', function() {
            const unitIndex = parseInt(folderItem.dataset.unitIndex);
            const folderIndex = parseInt(folderItem.dataset.folderIndex);
            const existingFolderIndex = appState.folderData.findIndex(folder => 
                folder.unitIndex === unitIndex && folder.folderIndex === folderIndex
            );
            
            if (existingFolderIndex !== -1) {
                appState.folderData[existingFolderIndex].folderName = this.value;
            } else {
                appState.folderData.push({
                    unitIndex: unitIndex,
                    folderIndex: folderIndex,
                    folderName: this.value
                });
            }
        });
        
        // Add event listener for check issues button
        const checkIssuesBtn = folderItem.querySelector('.check-issues-btn');
        checkIssuesBtn.addEventListener('click', function() {
            const unitIndex = parseInt(folderItem.dataset.unitIndex);
            const folderIndex = parseInt(folderItem.dataset.folderIndex);
            const folderName = folderNameInput.value;
            
            // Validate folder name
            if (!folderName.trim()) {
                alert('Please enter a folder name before checking issues.');
                return;
            }
            
            // Get unit name
            const unit = appState.unitData.find(unit => unit.unitIndex === unitIndex);
            const unitName = unit ? unit.unitName : 'Unknown Unit';
            
            // Update app state
            appState.currentTargetType = 'folder';
            appState.currentUnitIndex = unitIndex;
            appState.currentFolderIndex = folderIndex;
            appState.currentTargetName = folderName;
            
            // Update UI
            issueTargetHeader.textContent = `Select Issues for Folder: ${folderName} (in ${unitName})`;
            
            // Populate issues list
            populateIssuesList();
            
            // Navigate to issues screen
            navigateToScreen(issuesScreen);
        });
        
        // Add event listener for toggle button
        const toggleBtn = folderItem.querySelector('.toggle-btn');
        const folderContent = folderItem.querySelector('.folder-content');
        
        toggleBtn.addEventListener('click', function() {
            folderContent.classList.toggle('open');
            const icon = this.querySelector('i');
            icon.classList.toggle('fa-chevron-down');
            icon.classList.toggle('fa-chevron-up');
        });
        
        // Add event listeners for file controls
        const decreaseFileBtn = folderItem.querySelector('.decrease-file-btn');
        const fileCount = folderItem.querySelector('.file-count');
        const increaseFileBtn = folderItem.querySelector('.increase-file-btn');
        const filesContainer = folderItem.querySelector('.files-container');
        
        // Initialize file count
        const currentFileCount = appState.fileData.filter(file => 
            file.unitIndex === unitIndex && file.folderIndex === folderIndex
        ).length;
        fileCount.textContent = currentFileCount;
        
        // Add existing files
        for (let i = 0; i < currentFileCount; i++) {
            addFileToDOM(unitIndex, folderIndex, i, filesContainer);
        }
        
        // Add event listeners for file buttons
        decreaseFileBtn.addEventListener('click', function() {
            const unitIndex = parseInt(folderItem.dataset.unitIndex);
            const folderIndex = parseInt(folderItem.dataset.folderIndex);
            const currentFileCount = parseInt(fileCount.textContent);
            
            if (currentFileCount > 0) {
                // Update file count
                fileCount.textContent = currentFileCount - 1;
                
                // Remove the last file from the DOM
                const fileElements = filesContainer.querySelectorAll('.file-item');
                if (fileElements.length > 0) {
                    filesContainer.removeChild(fileElements[fileElements.length - 1]);
                }
                
                // Update app state
                appState.fileData = appState.fileData.filter(file => 
                    !(file.unitIndex === unitIndex && 
                      file.folderIndex === folderIndex && 
                      file.fileIndex === currentFileCount - 1)
                );
                appState.selectedIssues = appState.selectedIssues.filter(issue => 
                    !(issue.unitIndex === unitIndex && 
                      issue.folderIndex === folderIndex && 
                      issue.fileIndex === currentFileCount - 1)
                );
            }
        });
        
        increaseFileBtn.addEventListener('click', function() {
            const unitIndex = parseInt(folderItem.dataset.unitIndex);
            const folderIndex = parseInt(folderItem.dataset.folderIndex);
            const currentFileCount = parseInt(fileCount.textContent);
            
            // Update file count
            fileCount.textContent = currentFileCount + 1;
            
            // Add a new file to the DOM
            addFileToDOM(unitIndex, folderIndex, currentFileCount, filesContainer);
            
            // Update app state
            appState.fileData.push({
                unitIndex: unitIndex,
                folderIndex: folderIndex,
                fileIndex: currentFileCount,
                fileName: '',
                fileType: ''
            });
        });
        
        // Add the folder to the container
        foldersContainer.appendChild(folderItem);
    }

    // Add a file to the DOM
    function addFileToDOM(unitIndex, folderIndex, fileIndex, filesContainer) {
        // Clone the file template
        const fileNode = document.importNode(fileTemplate.content, true);
        const fileItem = fileNode.querySelector('.file-item');
        
        // Set file indices
        fileItem.dataset.unitIndex = unitIndex;
        fileItem.dataset.folderIndex = folderIndex;
        fileItem.dataset.fileIndex = fileIndex;
        
        // Get file inputs
        const fileNameInput = fileItem.querySelector('.file-name');
        const fileTypeInput = fileItem.querySelector('.file-type');
        
        // Set file data if exists in app state
        const existingFile = appState.fileData.find(file => 
            file.unitIndex === unitIndex && 
            file.folderIndex === folderIndex && 
            file.fileIndex === fileIndex
        );
        if (existingFile) {
            fileNameInput.value = existingFile.fileName;
            fileTypeInput.value = existingFile.fileType;
        }
        
        // Add event listener for file name input
        fileNameInput.addEventListener('input', function() {
            const unitIndex = parseInt(fileItem.dataset.unitIndex);
            const folderIndex = parseInt(fileItem.dataset.folderIndex);
            const fileIndex = parseInt(fileItem.dataset.fileIndex);
            const existingFileIndex = appState.fileData.findIndex(file => 
                file.unitIndex === unitIndex && 
                file.folderIndex === folderIndex && 
                file.fileIndex === fileIndex
            );
            
            if (existingFileIndex !== -1) {
                appState.fileData[existingFileIndex].fileName = this.value;
            } else {
                appState.fileData.push({
                    unitIndex: unitIndex,
                    folderIndex: folderIndex,
                    fileIndex: fileIndex,
                    fileName: this.value,
                    fileType: ''
                });
            }
        });
        
        // Add event listener for file type input
        fileTypeInput.addEventListener('input', function() {
            const unitIndex = parseInt(fileItem.dataset.unitIndex);
            const folderIndex = parseInt(fileItem.dataset.folderIndex);
            const fileIndex = parseInt(fileItem.dataset.fileIndex);
            const existingFileIndex = appState.fileData.findIndex(file => 
                file.unitIndex === unitIndex && 
                file.folderIndex === folderIndex && 
                file.fileIndex === fileIndex
            );
            
            if (existingFileIndex !== -1) {
                appState.fileData[existingFileIndex].fileType = this.value;
            } else {
                appState.fileData.push({
                    unitIndex: unitIndex,
                    folderIndex: folderIndex,
                    fileIndex: fileIndex,
                    fileName: '',
                    fileType: this.value
                });
            }
        });
        
        // Add event listener for check issues button
        const checkIssuesBtn = fileItem.querySelector('.check-issues-btn');
        checkIssuesBtn.addEventListener('click', function() {
            const unitIndex = parseInt(fileItem.dataset.unitIndex);
            const folderIndex = parseInt(fileItem.dataset.folderIndex);
            const fileIndex = parseInt(fileItem.dataset.fileIndex);
            const fileName = fileNameInput.value;
            
            // Validate file name
            if (!fileName.trim()) {
                alert('Please enter a file name before checking issues.');
                return;
            }
            
            // Get unit and folder names
            const unit = appState.unitData.find(unit => unit.unitIndex === unitIndex);
            const folder = appState.folderData.find(folder => 
                folder.unitIndex === unitIndex && folder.folderIndex === folderIndex
            );
            const unitName = unit ? unit.unitName : 'Unknown Unit';
            const folderName = folder ? folder.folderName : 'Unknown Folder';
            
            // Update app state
            appState.currentTargetType = 'file';
            appState.currentUnitIndex = unitIndex;
            appState.currentFolderIndex = folderIndex;
            appState.currentFileIndex = fileIndex;
            appState.currentTargetName = fileName;
            
            // Update UI
            issueTargetHeader.textContent = `Select Issues for File: ${fileName} (in ${folderName}, ${unitName})`;
            
            // Populate issues list
            populateIssuesList();
            
            // Navigate to issues screen
            navigateToScreen(issuesScreen);
        });
        
        // Add the file to the container
        filesContainer.appendChild(fileItem);
    }

    // Populate the issues list
    function populateIssuesList() {
        // Clear the issues list
        issuesList.innerHTML = '';
        
        // Add each issue type
        issueTypes.forEach(issueType => {
            // Clone the issue template
            const issueNode = document.importNode(issueTemplate.content, true);
            const issueItem = issueNode.querySelector('.issue-item');
            
            // Set issue ID
            issueItem.dataset.issueId = issueType.id;
            // Set search text attribute for filtering
            issueItem.dataset.searchText = (issueType.name + ' ' + issueType.description).toLowerCase();
            
            // Get issue elements
            const issueCheckbox = issueItem.querySelector('.issue-checkbox');
            const issueName = issueItem.querySelector('.issue-name');
            const issueDescription = issueItem.querySelector('.issue-description');
            const issueNotes = issueItem.querySelector('.issue-notes');
            const issueNotesTextarea = issueNotes.querySelector('textarea');
            
            // Set issue data
            issueName.textContent = issueType.name;
            issueDescription.textContent = issueType.description;
            
            // Check if issue is already selected
            let existingIssue;
            
            if (appState.currentTargetType === 'unit') {
                existingIssue = appState.selectedIssues.find(issue => 
                    issue.targetType === 'unit' &&
                    issue.unitIndex === appState.currentUnitIndex && 
                    issue.issueId === issueType.id
                );
            } else if (appState.currentTargetType === 'folder') {
                existingIssue = appState.selectedIssues.find(issue => 
                    issue.targetType === 'folder' &&
                    issue.unitIndex === appState.currentUnitIndex && 
                    issue.folderIndex === appState.currentFolderIndex && 
                    issue.issueId === issueType.id
                );
            } else if (appState.currentTargetType === 'file') {
                existingIssue = appState.selectedIssues.find(issue => 
                    issue.targetType === 'file' &&
                    issue.unitIndex === appState.currentUnitIndex && 
                    issue.folderIndex === appState.currentFolderIndex && 
                    issue.fileIndex === appState.currentFileIndex && 
                    issue.issueId === issueType.id
                );
            }
            
            if (existingIssue) {
                issueCheckbox.checked = true;
                issueNotes.classList.remove('hidden');
                issueNotesTextarea.value = existingIssue.notes || '';
            }
            
            // Add event listener for checkbox
            issueCheckbox.addEventListener('change', function() {
                if (this.checked) {
                    // Show notes textarea with smooth transition
                    issueNotes.classList.remove('hidden');
                    issueNotes.style.maxHeight = '0';
                    setTimeout(() => {
                        issueNotes.style.maxHeight = issueNotes.scrollHeight + 'px';
                    }, 10);
                    
                    // Add issue to selected issues
                    const newIssue = {
                        targetType: appState.currentTargetType,
                        unitIndex: appState.currentUnitIndex,
                        issueId: issueType.id,
                        issueName: issueType.name,
                        notes: ''
                    };
                    
                    if (appState.currentTargetType === 'folder' || appState.currentTargetType === 'file') {
                        newIssue.folderIndex = appState.currentFolderIndex;
                    }
                    
                    if (appState.currentTargetType === 'file') {
                        newIssue.fileIndex = appState.currentFileIndex;
                    }
                    
                    appState.selectedIssues.push(newIssue);
                } else {
                    // Hide notes textarea with smooth transition
                    issueNotes.style.maxHeight = '0';
                    setTimeout(() => {
                        issueNotes.classList.add('hidden');
                    }, 300);
                    
                    // Remove issue from selected issues
                    if (appState.currentTargetType === 'unit') {
                        appState.selectedIssues = appState.selectedIssues.filter(issue => 
                            !(issue.targetType === 'unit' &&
                              issue.unitIndex === appState.currentUnitIndex && 
                              issue.issueId === issueType.id)
                        );
                    } else if (appState.currentTargetType === 'folder') {
                        appState.selectedIssues = appState.selectedIssues.filter(issue => 
                            !(issue.targetType === 'folder' &&
                              issue.unitIndex === appState.currentUnitIndex && 
                              issue.folderIndex === appState.currentFolderIndex && 
                              issue.issueId === issueType.id)
                        );
                    } else if (appState.currentTargetType === 'file') {
                        appState.selectedIssues = appState.selectedIssues.filter(issue => 
                            !(issue.targetType === 'file' &&
                              issue.unitIndex === appState.currentUnitIndex && 
                              issue.folderIndex === appState.currentFolderIndex && 
                              issue.fileIndex === appState.currentFileIndex && 
                              issue.issueId === issueType.id)
                        );
                    }
                }
            });
            
            // Add event listener for notes textarea
            issueNotesTextarea.addEventListener('input', function() {
                let existingIssueIndex;
                
                if (appState.currentTargetType === 'unit') {
                    existingIssueIndex = appState.selectedIssues.findIndex(issue => 
                        issue.targetType === 'unit' &&
                        issue.unitIndex === appState.currentUnitIndex && 
                        issue.issueId === issueType.id
                    );
                } else if (appState.currentTargetType === 'folder') {
                    existingIssueIndex = appState.selectedIssues.findIndex(issue => 
                        issue.targetType === 'folder' &&
                        issue.unitIndex === appState.currentUnitIndex && 
                        issue.folderIndex === appState.currentFolderIndex && 
                        issue.issueId === issueType.id
                    );
                } else if (appState.currentTargetType === 'file') {
                    existingIssueIndex = appState.selectedIssues.findIndex(issue => 
                        issue.targetType === 'file' &&
                        issue.unitIndex === appState.currentUnitIndex && 
                        issue.folderIndex === appState.currentFolderIndex && 
                        issue.fileIndex === appState.currentFileIndex && 
                        issue.issueId === issueType.id
                    );
                }
                
                if (existingIssueIndex !== -1) {
                    appState.selectedIssues[existingIssueIndex].notes = this.value;
                }
            });
            
            // Add the issue to the list
            issuesList.appendChild(issueItem);
        });
    }

    // Filter issues based on search input
    function filterIssues() {
        const searchText = issuesSearchInput.value.toLowerCase();
        const issueItems = issuesList.querySelectorAll('.issue-item');
        
        issueItems.forEach(item => {
            const itemText = item.dataset.searchText;
            if (itemText.includes(searchText)) {
                item.classList.remove('hidden');
            } else {
                item.classList.add('hidden');
            }
        });
    }

    // Done selecting issues
    function doneSelectingIssues() {
        navigateToBuilder();
    }

    // Review issues
    function reviewIssues() {
        // Check if there are any issues selected
        if (appState.selectedIssues.length === 0) {
            alert('No issues have been identified yet. Please check issues for at least one unit, folder, or file.');
            return;
        }
        
        // Update UI
        reviewHeader.textContent = `Review Issues for: ${appState.courseName}`;
        totalIssuesCount.textContent = `Total Issues Found: ${appState.selectedIssues.length}`;
        
        // Populate selected issues list
        populateSelectedIssuesList();
        
        // Navigate to review screen
        navigateToScreen(reviewScreen);
    }

    // Populate the selected issues list
    function populateSelectedIssuesList() {
        // Clear the selected issues list
        selectedIssuesList.innerHTML = '';
        
        // Add each selected issue
        appState.selectedIssues.forEach(issue => {
            // Clone the selected issue template
            const selectedIssueNode = document.importNode(selectedIssueTemplate.content, true);
            const selectedIssueItem = selectedIssueNode.querySelector('.selected-issue-item');
            
            // Get issue elements
            const issueLocation = selectedIssueItem.querySelector('.issue-location');
            const issueName = selectedIssueItem.querySelector('.issue-name');
            const issueNotes = selectedIssueItem.querySelector('.issue-notes');
            
            // Get unit, folder, and file names
            const unit = appState.unitData.find(unit => unit.unitIndex === issue.unitIndex);
            const unitName = unit ? unit.unitName : 'Unknown Unit';
            
            let locationText = '';
            
            if (issue.targetType === 'unit') {
                locationText = `Unit: ${unitName}`;
            } else if (issue.targetType === 'folder') {
                const folder = appState.folderData.find(folder => 
                    folder.unitIndex === issue.unitIndex && 
                    folder.folderIndex === issue.folderIndex
                );
                const folderName = folder ? folder.folderName : 'Unknown Folder';
                locationText = `${unitName} > Folder: ${folderName}`;
            } else if (issue.targetType === 'file') {
                const folder = appState.folderData.find(folder => 
                    folder.unitIndex === issue.unitIndex && 
                    folder.folderIndex === issue.folderIndex
                );
                const file = appState.fileData.find(file => 
                    file.unitIndex === issue.unitIndex && 
                    file.folderIndex === issue.folderIndex && 
                    file.fileIndex === issue.fileIndex
                );
                const folderName = folder ? folder.folderName : 'Unknown Folder';
                const fileName = file ? file.fileName : 'Unknown File';
                locationText = `${unitName} > ${folderName} > File: ${fileName}`;
            }
            
            // Set issue data
            issueLocation.textContent = locationText;
            issueName.textContent = issue.issueName;
            issueNotes.textContent = issue.notes || 'No notes provided';
            
            // Add the selected issue to the list
            selectedIssuesList.appendChild(selectedIssueItem);
        });
    }

    // Submit issues
    function submitIssues() {
        // Show loading message
        confirmationMessage.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting issues...';
        navigateToScreen(confirmationScreen);
        
        // Submit data to SharePoint
        submitToSharePoint()
            .then(() => {
                // Update UI
                confirmationMessage.innerHTML = `<i class="fas fa-check-circle"></i><br>All issues for course ${appState.courseName} have been submitted successfully!`;
            })
            .catch(error => {
                confirmationMessage.innerHTML = `<i class="fas fa-exclamation-triangle" style="color: var(--error-color);"></i><br>Error submitting issues: ${error.message}`;
            });
    }

    // Submit data to SharePoint
    function submitToSharePoint() {
        return new Promise((resolve, reject) => {
            // This is a placeholder for the actual SharePoint submission code
            // In a real implementation, you would use the SharePoint REST API
            
            // Example code for submitting to SharePoint (not functional in this demo):
            /*
            // First, create or update the course
            const courseData = {
                Title: appState.courseName,
                CourseID: appState.courseId,
                FacultyEmail: appState.facultyEmail,
                Status: "Active",
                LastEvaluationDate: new Date().toISOString()
            };
            
            // Submit course data
            submitItemToSharePoint('Courses', courseData)
                .then(courseResponse => {
                    // Process units
                    const unitPromises = appState.unitData.map(unit => {
                        const unitData = {
                            Title: unit.unitName,
                            UnitID: `U${unit.unitIndex}_${appState.courseId}`,
                            CourseIDId: courseResponse.Id, // Lookup field
                            UnitNumber: unit.unitIndex,
                            Status: "Active"
                        };
                        return submitItemToSharePoint('Units', unitData);
                    });
                    
                    return Promise.all(unitPromises);
                })
                .then(unitResponses => {
                    // Process folders
                    const folderPromises = appState.folderData.map(folder => {
                        const unitId = unitResponses.find(u => 
                            u.UnitID === `U${folder.unitIndex}_${appState.courseId}`
                        ).Id;
                        
                        const folderData = {
                            Title: folder.folderName,
                            FolderID: `F${folder.unitIndex}_${folder.folderIndex}_${appState.courseId}`,
                            UnitIDId: unitId, // Lookup field
                            Status: "Active"
                        };
                        return submitItemToSharePoint('Folders', folderData);
                    });
                    
                    return Promise.all(folderPromises);
                })
                .then(folderResponses => {
                    // Process files
                    const filePromises = appState.fileData.map(file => {
                        const folderId = folderResponses.find(f => 
                            f.FolderID === `F${file.unitIndex}_${file.folderIndex}_${appState.courseId}`
                        ).Id;
                        
                        const fileData = {
                            Title: file.fileName,
                            FileID: `FL${file.unitIndex}_${file.folderIndex}_${file.fileIndex}_${appState.courseId}`,
                            FolderIDId: folderId, // Lookup field
                            FileType: file.fileType,
                            Status: "Active"
                        };
                        return submitItemToSharePoint('Files', fileData);
                    });
                    
                    return Promise.all(filePromises);
                })
                .then(fileResponses => {
                    // Process issues
                    const issuePromises = appState.selectedIssues.map(issue => {
                        let itemData = {
                            Title: `Issue_${issue.issueId}_${appState.courseId}`,
                            IssueTypeIDId: issue.issueId, // Lookup field
                            DateIdentified: new Date().toISOString(),
                            IdentifiedBy: "Current User", // Would be actual user in real implementation
                            Status: "Open",
                            Notes: issue.notes,
                            TargetType: issue.targetType
                        };
                        
                        if (issue.targetType === 'unit') {
                            const unitId = unitResponses.find(u => 
                                u.UnitID === `U${issue.unitIndex}_${appState.courseId}`
                            ).Id;
                            itemData.UnitIDId = unitId;
                        } else if (issue.targetType === 'folder') {
                            const folderId = folderResponses.find(f => 
                                f.FolderID === `F${issue.unitIndex}_${issue.folderIndex}_${appState.courseId}`
                            ).Id;
                            itemData.FolderIDId = folderId;
                        } else if (issue.targetType === 'file') {
                            const fileId = fileResponses.find(f => 
                                f.FileID === `FL${issue.unitIndex}_${issue.folderIndex}_${issue.fileIndex}_${appState.courseId}`
                            ).Id;
                            itemData.FileIDId = fileId;
                        }
                        
                        return submitItemToSharePoint('IssueInstances', itemData);
                    });
                    
                    return Promise.all(issuePromises);
                })
                .then(() => {
                    resolve();
                })
                .catch(error => {
                    reject(error);
                });
            */
            
            // For demo purposes, we'll just resolve the promise after a delay
            setTimeout(() => {
                resolve();
            }, 2000);
        });
    }

    // Submit item to SharePoint
    function submitItemToSharePoint(listName, itemData) {
        return new Promise((resolve, reject) => {
            // This is a placeholder for the actual SharePoint submission code
            // In a real implementation, you would use the SharePoint REST API
            
            // Example code for submitting to SharePoint (not functional in this demo):
            /*
            const siteUrl = "https://maristcollege.sharepoint.com/sites/CourseIssueTracker";
            const endpoint = `${siteUrl}/_api/web/lists/getbytitle('${listName}')/items`;
            
            // Check if item already exists (for update)
            // This would require additional code to check for existing items
            
            // For simplicity, we'll just create new items
            fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json;odata=verbose',
                    'Content-Type': 'application/json;odata=verbose',
                    'X-RequestDigest': document.getElementById('__REQUESTDIGEST').value, // Would need to get this from SharePoint
                    'IF-MATCH': '*',
                    'X-HTTP-Method': 'POST'
                },
                body: JSON.stringify({
                    __metadata: {
                        type: `SP.Data.${listName}ListItem`
                    },
                    ...itemData
                })
            })
            .then(response => response.json())
            .then(data => {
                resolve(data.d);
            })
            .catch(error => {
                reject(error);
            });
            */
            
            // For demo purposes, we'll just resolve the promise with mock data
            resolve({
                Id: Math.floor(Math.random() * 1000),
                ...itemData
            });
        });
    }

    // Show email modal
    function showEmailModal() {
        // Populate email subject
        emailSubject.value = `Course Issues Report: ${appState.courseName}`;
        
        // Populate email body
        let emailBodyText = `Dear Faculty Member,\n\n`;
        emailBodyText += `We have completed an evaluation of your course ${appState.courseName} (${appState.courseId}) and identified the following issues that require attention:\n\n`;
        
        // Group issues by severity
        const highPriorityIssues = [];
        const mediumPriorityIssues = [];
        const lowPriorityIssues = [];
        
        appState.selectedIssues.forEach(issue => {
            const issueType = issueTypes.find(type => type.id === issue.issueId);
            
            let locationText = '';
            
            if (issue.targetType === 'unit') {
                const unit = appState.unitData.find(unit => unit.unitIndex === issue.unitIndex);
                const unitName = unit ? unit.unitName : 'Unknown Unit';
                locationText = `Unit: ${unitName}`;
            } else if (issue.targetType === 'folder') {
                const unit = appState.unitData.find(unit => unit.unitIndex === issue.unitIndex);
                const folder = appState.folderData.find(folder => 
                    folder.unitIndex === issue.unitIndex && 
                    folder.folderIndex === issue.folderIndex
                );
                const unitName = unit ? unit.unitName : 'Unknown Unit';
                const folderName = folder ? folder.folderName : 'Unknown Folder';
                locationText = `${unitName} > Folder: ${folderName}`;
            } else if (issue.targetType === 'file') {
                const unit = appState.unitData.find(unit => unit.unitIndex === issue.unitIndex);
                const folder = appState.folderData.find(folder => 
                    folder.unitIndex === issue.unitIndex && 
                    folder.folderIndex === issue.folderIndex
                );
                const file = appState.fileData.find(file => 
                    file.unitIndex === issue.unitIndex && 
                    file.folderIndex === issue.folderIndex && 
                    file.fileIndex === issue.fileIndex
                );
                const unitName = unit ? unit.unitName : 'Unknown Unit';
                const folderName = folder ? folder.folderName : 'Unknown Folder';
                const fileName = file ? file.fileName : 'Unknown File';
                locationText = `${unitName} > ${folderName} > File: ${fileName}`;
            }
            
            const issueInfo = {
                location: locationText,
                name: issue.issueName,
                notes: issue.notes || 'No notes provided',
                severity: issueType ? issueType.severity : 'Medium'
            };
            
            if (issueInfo.severity === 'High') {
                highPriorityIssues.push(issueInfo);
            } else if (issueInfo.severity === 'Medium') {
                mediumPriorityIssues.push(issueInfo);
            } else {
                lowPriorityIssues.push(issueInfo);
            }
        });
        
        // Add summary
        emailBodyText += `Summary:\n`;
        emailBodyText += `- Total issues found: ${appState.selectedIssues.length}\n`;
        emailBodyText += `- High priority issues: ${highPriorityIssues.length}\n`;
        emailBodyText += `- Medium priority issues: ${mediumPriorityIssues.length}\n`;
        emailBodyText += `- Low priority issues: ${lowPriorityIssues.length}\n\n`;
        
        // Add high priority issues
        if (highPriorityIssues.length > 0) {
            emailBodyText += `High Priority Issues:\n`;
            highPriorityIssues.forEach(issue => {
                emailBodyText += `- ${issue.location}: ${issue.name}\n  ${issue.notes}\n\n`;
            });
        }
        
        // Add medium priority issues
        if (mediumPriorityIssues.length > 0) {
            emailBodyText += `Medium Priority Issues:\n`;
            mediumPriorityIssues.forEach(issue => {
                emailBodyText += `- ${issue.location}: ${issue.name}\n  ${issue.notes}\n\n`;
            });
        }
        
        // Add low priority issues
        if (lowPriorityIssues.length > 0) {
            emailBodyText += `Low Priority Issues:\n`;
            lowPriorityIssues.forEach(issue => {
                emailBodyText += `- ${issue.location}: ${issue.name}\n  ${issue.notes}\n\n`;
            });
        }
        
        // Add closing
        emailBodyText += `Please address these issues at your earliest convenience. If you need assistance, please contact the course support team.\n\n`;
        emailBodyText += `Thank you,\nCourse Evaluation Team`;
        
        // Set email body
        emailBody.value = emailBodyText;
        
        // Show modal
        emailModal.style.display = 'block';
    }

    // Close email modal
    function closeEmailModal() {
        emailModal.style.display = 'none';
    }

    // Send email
    function sendEmail() {
        // Here we would normally send the email
        // For this demo, we'll simulate sending the email
        
        // In a real implementation, you would use the SharePoint REST API
        // or another method to send the email
        
        // Example of how to send an email (not functional in this demo):
        /*
        const emailData = {
            To: [appState.facultyEmail],
            Subject: emailSubject.value,
            Body: emailBody.value,
            BodyType: "Text"
        };
        
        const siteUrl = "https://maristcollege.sharepoint.com/sites/CourseIssueTracker";
        const endpoint = `${siteUrl}/_api/SP.Utilities.Utility.SendEmail`;
        
        fetch(endpoint, {
            method: 'POST',
            headers: {
                'Accept': 'application/json;odata=verbose',
                'Content-Type': 'application/json;odata=verbose',
                'X-RequestDigest': document.getElementById('__REQUESTDIGEST').value, // Would need to get this from SharePoint
            },
            body: JSON.stringify(emailData)
        })
        .then(response => {
            if (response.ok) {
                alert('Email sent successfully!');
                closeEmailModal();
            } else {
                throw new Error('Failed to send email');
            }
        })
        .catch(error => {
            alert(`Error sending email: ${error.message}`);
        });
        */
        
        // For demo purposes, we'll just show an alert
        alert(`Email sent successfully to ${appState.facultyEmail}!`);
        closeEmailModal();
    }

    // Save progress
    function saveProgress() {
        // Create a draft object
        const draft = {
            courseId: appState.courseId,
            courseName: appState.courseName,
            facultyEmail: appState.facultyEmail,
            unitCount: appState.unitCount,
            unitData: appState.unitData,
            folderData: appState.folderData,
            fileData: appState.fileData,
            selectedIssues: appState.selectedIssues,
            savedDate: new Date()
        };
        
        // Save to local storage
        const savedDrafts = JSON.parse(localStorage.getItem('courseIssuesDrafts') || '[]');
        savedDrafts.push(draft);
        localStorage.setItem('courseIssuesDrafts', JSON.stringify(savedDrafts));
        
        // Show success message
        alert('Progress saved successfully!');
        
        // Reload saved drafts
        loadSavedDrafts();
    }

    // Load saved drafts
    function loadSavedDrafts() {
        // Get saved drafts from local storage
        const savedDrafts = JSON.parse(localStorage.getItem('courseIssuesDrafts') || '[]');
        
        // Clear the saved drafts list
        savedDraftsList.innerHTML = '';
        
        // Add each saved draft
        if (savedDrafts.length > 0) {
            savedDrafts.forEach((draft, index) => {
                // Clone the saved draft template
                const savedDraftNode = document.importNode(savedDraftTemplate.content, true);
                const savedDraftItem = savedDraftNode.querySelector('.saved-draft-item');
                
                // Set draft ID
                savedDraftItem.dataset.draftId = index;
                
                // Get draft elements
                const draftName = savedDraftItem.querySelector('.draft-name');
                const draftDate = savedDraftItem.querySelector('.draft-date');
                const loadDraftBtn = savedDraftItem.querySelector('.load-draft-btn');
                const deleteDraftBtn = savedDraftItem.querySelector('.delete-draft-btn');
                
                // Set draft data
                draftName.textContent = `${draft.courseName} (${draft.courseId})`;
                draftDate.textContent = new Date(draft.savedDate).toLocaleString();
                
                // Add event listener for load draft button
                loadDraftBtn.addEventListener('click', function() {
                    // Load draft data into app state
                    appState.courseId = draft.courseId;
                    appState.courseName = draft.courseName;
                    appState.facultyEmail = draft.facultyEmail;
                    appState.unitCount = draft.unitCount;
                    appState.unitData = draft.unitData;
                    appState.folderData = draft.folderData;
                    appState.fileData = draft.fileData;
                    appState.selectedIssues = draft.selectedIssues;
                    
                    // Update UI
                    courseIdInput.value = draft.courseId;
                    courseNameInput.value = draft.courseName;
                    facultyEmailInput.value = draft.facultyEmail;
                    courseHeader.textContent = `Building Structure for: ${draft.courseName} (${draft.courseId})`;
                    unitCount.textContent = draft.unitCount;
                    
                    // Clear units container
                    unitsContainer.innerHTML = '';
                    
                    // Add units to DOM
                    for (let i = 0; i < draft.unitCount; i++) {
                        addUnitToDOM(i);
                    }
                    
                    // Navigate to builder screen
                    navigateToScreen(builderScreen);
                });
                
                // Add event listener for delete draft button
                deleteDraftBtn.addEventListener('click', function() {
                    if (confirm('Are you sure you want to delete this draft?')) {
                        // Remove draft from local storage
                        const savedDrafts = JSON.parse(localStorage.getItem('courseIssuesDrafts') || '[]');
                        savedDrafts.splice(index, 1);
                        localStorage.setItem('courseIssuesDrafts', JSON.stringify(savedDrafts));
                        
                        // Reload saved drafts
                        loadSavedDrafts();
                    }
                });
                
                // Add the saved draft to the list
                savedDraftsList.appendChild(savedDraftItem);
            });
        } else {
            // Show empty message
            const emptyMessage = document.createElement('p');
            emptyMessage.className = 'empty-message';
            emptyMessage.textContent = 'No saved drafts found.';
            savedDraftsList.appendChild(emptyMessage);
        }
        
        // Show/hide clear all drafts button
        clearAllDraftsBtn.style.display = savedDrafts.length > 0 ? 'block' : 'none';
    }
    
    // Clear all drafts
    function clearAllDrafts() {
        if (confirm('Are you sure you want to delete all saved drafts? This action cannot be undone.')) {
            // Clear drafts from local storage
            localStorage.removeItem('courseIssuesDrafts');
            
            // Reload saved drafts
            loadSavedDrafts();
        }
    }

    // Navigate to home screen
    function navigateToHome() {
        navigateToScreen(homeScreen);
    }

    // Navigate to builder screen
    function navigateToBuilder() {
        navigateToScreen(builderScreen);
    }

    // Reset and navigate to home screen
    function resetAndNavigateToHome() {
        // Reset app state
        appState.courseId = '';
        appState.courseName = '';
        appState.facultyEmail = '';
        appState.unitCount = 0;
        appState.unitData = [];
        appState.folderData = [];
        appState.fileData = [];
        appState.selectedIssues = [];
        
        // Reset UI
        courseIdInput.value = '';
        courseNameInput.value = '';
        facultyEmailInput.value = '';
        unitCount.textContent = '0';
        unitsContainer.innerHTML = '';
        
        // Navigate to home screen
        navigateToScreen(homeScreen);
    }

    // Navigate to a screen
    function navigateToScreen(screen) {
        // Hide all screens
        document.querySelectorAll('.screen').forEach(s => {
            s.classList.remove('active');
        });
        
        // Show the target screen
        screen.classList.add('active');
        
        // Scroll to top
        window.scrollTo(0, 0);
    }
});
