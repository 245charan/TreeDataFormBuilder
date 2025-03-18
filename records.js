// Records Viewer Logic
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements - Search Screen
    const searchScreen = document.getElementById('searchScreen');
    const searchCourseId = document.getElementById('searchCourseId');
    const searchCourseName = document.getElementById('searchCourseName');
    const searchFacultyEmail = document.getElementById('searchFacultyEmail');
    const searchDateFrom = document.getElementById('searchDateFrom');
    const searchDateTo = document.getElementById('searchDateTo');
    const searchIssueType = document.getElementById('searchIssueType');
    const searchStatus = document.getElementById('searchStatus');
    const searchBtn = document.getElementById('searchBtn');
    const clearSearchBtn = document.getElementById('clearSearchBtn');
    const searchResults = document.getElementById('searchResults');
    const exportCsvBtn = document.getElementById('exportCsvBtn');

    // DOM Elements - Course Details Screen
    const courseDetailsScreen = document.getElementById('courseDetailsScreen');
    const backToSearchBtn = document.getElementById('backToSearchBtn');
    const courseDetailsHeader = document.getElementById('courseDetailsHeader');
    const detailsCourseId = document.getElementById('detailsCourseId');
    const detailsCourseName = document.getElementById('detailsCourseName');
    const detailsFacultyEmail = document.getElementById('detailsFacultyEmail');
    const detailsLastEvaluation = document.getElementById('detailsLastEvaluation');
    const detailsTotalIssues = document.getElementById('detailsTotalIssues');
    const detailsOpenIssues = document.getElementById('detailsOpenIssues');
    const courseStructure = document.getElementById('courseStructure');
    const exportCourseDetailsCsvBtn = document.getElementById('exportCourseDetailsCsvBtn');

    // Templates
    const searchResultTemplate = document.getElementById('searchResultTemplate');
    const unitStructureTemplate = document.getElementById('unitStructureTemplate');
    const folderStructureTemplate = document.getElementById('folderStructureTemplate');
    const fileStructureTemplate = document.getElementById('fileStructureTemplate');
    const issueStructureTemplate = document.getElementById('issueStructureTemplate');

    // Application State
    const appState = {
        searchResults: [],
        currentCourseDetails: null,
        currentCourseStructure: null
    };

    // Initialize the application
    initApp();

    // Event Listeners - Search Screen
    searchBtn.addEventListener('click', searchRecords);
    clearSearchBtn.addEventListener('click', clearSearch);
    exportCsvBtn.addEventListener('click', exportSearchResultsToCsv);

    // Event Listeners - Course Details Screen
    backToSearchBtn.addEventListener('click', navigateToSearch);
    exportCourseDetailsCsvBtn.addEventListener('click', exportCourseDetailsToCsv);

    // Initialize the application
    function initApp() {
        // Populate issue types dropdown
        populateIssueTypesDropdown();
        
        // Set default date range (last 30 days)
        const today = new Date();
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(today.getDate() - 30);
        
        searchDateTo.valueAsDate = today;
        searchDateFrom.valueAsDate = thirtyDaysAgo;
    }

    // Populate issue types dropdown
    function populateIssueTypesDropdown() {
        issueTypes.forEach(issueType => {
            const option = document.createElement('option');
            option.value = issueType.id;
            option.textContent = issueType.name;
            searchIssueType.appendChild(option);
        });
    }

    // Search records
    function searchRecords() {
        // Get search criteria
        const criteria = {
            courseId: searchCourseId.value.trim(),
            courseName: searchCourseName.value.trim(),
            facultyEmail: searchFacultyEmail.value.trim(),
            dateFrom: searchDateFrom.value ? new Date(searchDateFrom.value) : null,
            dateTo: searchDateTo.value ? new Date(searchDateTo.value) : null,
            issueType: searchIssueType.value,
            status: searchStatus.value
        };
        
        // Show loading indicator
        searchResults.innerHTML = '<p class="loading-message">Searching records...</p>';
        
        // Call SharePoint search function
        searchSharePointRecords(criteria)
            .then(results => {
                // Update app state
                appState.searchResults = results;
                
                // Update UI
                displaySearchResults(results);
                
                // Enable export button if results found
                exportCsvBtn.disabled = results.length === 0;
            })
            .catch(error => {
                searchResults.innerHTML = `<p class="error-message">Error searching records: ${error.message}</p>`;
                exportCsvBtn.disabled = true;
            });
    }

    // Search SharePoint records
    function searchSharePointRecords(criteria) {
        return new Promise((resolve, reject) => {
            // This is a placeholder for the actual SharePoint search code
            // In a real implementation, you would use the SharePoint REST API
            
            // Example code for searching SharePoint (not functional in this demo):
            /*
            const siteUrl = "https://maristcollege.sharepoint.com/sites/CourseIssueTracker";
            let endpoint = `${siteUrl}/_api/web/lists/getbytitle('Courses')/items?$select=Id,Title,CourseID,FacultyEmail,LastEvaluationDate,Status`;
            
            // Build filter string
            let filterParts = [];
            
            if (criteria.courseId) {
                filterParts.push(`substringof('${criteria.courseId}', CourseID)`);
            }
            
            if (criteria.courseName) {
                filterParts.push(`substringof('${criteria.courseName}', Title)`);
            }
            
            if (criteria.facultyEmail) {
                filterParts.push(`substringof('${criteria.facultyEmail}', FacultyEmail)`);
            }
            
            if (criteria.dateFrom) {
                filterParts.push(`LastEvaluationDate ge datetime'${criteria.dateFrom.toISOString()}'`);
            }
            
            if (criteria.dateTo) {
                filterParts.push(`LastEvaluationDate le datetime'${criteria.dateTo.toISOString()}'`);
            }
            
            if (filterParts.length > 0) {
                endpoint += `&$filter=${filterParts.join(' and ')}`;
            }
            
            fetch(endpoint, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json;odata=verbose'
                }
            })
            .then(response => response.json())
            .then(data => {
                const courses = data.d.results;
                
                // For each course, get issue counts
                const coursePromises = courses.map(course => {
                    return getIssueCountsForCourse(course.CourseID, criteria.issueType, criteria.status)
                        .then(issueCounts => {
                            return {
                                id: course.Id,
                                courseId: course.CourseID,
                                courseName: course.Title,
                                facultyEmail: course.FacultyEmail,
                                lastEvaluation: new Date(course.LastEvaluationDate),
                                status: course.Status,
                                totalIssues: issueCounts.total,
                                openIssues: issueCounts.open
                            };
                        });
                });
                
                return Promise.all(coursePromises);
            })
            .then(results => {
                resolve(results);
            })
            .catch(error => {
                reject(error);
            });
            */
            
            // For demo purposes, we'll just return mock data after a delay
            setTimeout(() => {
                // Generate between 0 and 10 mock results
                const resultCount = Math.floor(Math.random() * 11);
                const results = [];
                
                for (let i = 0; i < resultCount; i++) {
                    const courseId = criteria.courseId || `COURSE${1000 + i}`;
                    const courseName = criteria.courseName || `Sample Course ${i + 1}`;
                    const facultyEmail = criteria.facultyEmail || `faculty${i + 1}@example.com`;
                    
                    // Generate a random date within the specified range or last 30 days
                    let lastEvaluation;
                    if (criteria.dateFrom && criteria.dateTo) {
                        const fromTime = criteria.dateFrom.getTime();
                        const toTime = criteria.dateTo.getTime();
                        lastEvaluation = new Date(fromTime + Math.random() * (toTime - fromTime));
                    } else {
                        const now = new Date();
                        const thirtyDaysAgo = new Date();
                        thirtyDaysAgo.setDate(now.getDate() - 30);
                        lastEvaluation = new Date(thirtyDaysAgo.getTime() + Math.random() * (now.getTime() - thirtyDaysAgo.getTime()));
                    }
                    
                    // Generate random issue counts
                    const totalIssues = Math.floor(Math.random() * 50);
                    const openIssues = Math.floor(Math.random() * (totalIssues + 1));
                    
                    results.push({
                        id: i + 1,
                        courseId: courseId,
                        courseName: courseName,
                        facultyEmail: facultyEmail,
                        lastEvaluation: lastEvaluation,
                        status: 'Active',
                        totalIssues: totalIssues,
                        openIssues: openIssues
                    });
                }
                
                resolve(results);
            }, 1000);
        });
    }

    // Get issue counts for a course
    function getIssueCountsForCourse(courseId, issueType, status) {
        return new Promise((resolve, reject) => {
            // This is a placeholder for the actual SharePoint query code
            // In a real implementation, you would use the SharePoint REST API
            
            // Example code for querying SharePoint (not functional in this demo):
            /*
            const siteUrl = "https://maristcollege.sharepoint.com/sites/CourseIssueTracker";
            let endpoint = `${siteUrl}/_api/web/lists/getbytitle('IssueInstances')/items?$select=Id,Status&$filter=FileID/FolderID/UnitID/CourseID eq '${courseId}'`;
            
            if (issueType) {
                endpoint += ` and IssueTypeID eq '${issueType}'`;
            }
            
            if (status) {
                endpoint += ` and Status eq '${status}'`;
            }
            
            fetch(endpoint, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json;odata=verbose'
                }
            })
            .then(response => response.json())
            .then(data => {
                const issues = data.d.results;
                const total = issues.length;
                const open = issues.filter(issue => issue.Status === 'Open').length;
                
                resolve({
                    total: total,
                    open: open
                });
            })
            .catch(error => {
                reject(error);
            });
            */
            
            // For demo purposes, we'll just return random counts
            setTimeout(() => {
                const total = Math.floor(Math.random() * 50);
                const open = Math.floor(Math.random() * (total + 1));
                
                resolve({
                    total: total,
                    open: open
                });
            }, 500);
        });
    }

    // Display search results
    function displaySearchResults(results) {
        // Clear the search results
        searchResults.innerHTML = '';
        
        // Add each search result
        if (results.length > 0) {
            results.forEach(result => {
                // Clone the search result template
                const searchResultNode = document.importNode(searchResultTemplate.content, true);
                const searchResultItem = searchResultNode.querySelector('.search-result-item');
                
                // Set course ID
                searchResultItem.dataset.courseId = result.courseId;
                
                // Get result elements
                const courseName = searchResultItem.querySelector('.course-name');
                const courseId = searchResultItem.querySelector('.course-id');
                const facultyEmail = searchResultItem.querySelector('.faculty-email');
                const lastEvaluation = searchResultItem.querySelector('.last-evaluation');
                const issueCount = searchResultItem.querySelector('.issue-count');
                const viewDetailsBtn = searchResultItem.querySelector('.view-details-btn');
                
                // Set result data
                courseName.textContent = result.courseName;
                courseId.textContent = `ID: ${result.courseId}`;
                facultyEmail.textContent = `Email: ${result.facultyEmail}`;
                lastEvaluation.textContent = `Last Evaluated: ${result.lastEvaluation.toLocaleDateString()}`;
                issueCount.textContent = `Issues: ${result.openIssues} open / ${result.totalIssues} total`;
                
                // Add event listener for view details button
                viewDetailsBtn.addEventListener('click', function() {
                    viewCourseDetails(result.courseId);
                });
                
                // Add the search result to the list
                searchResults.appendChild(searchResultItem);
            });
        } else {
            // Show empty message
            const emptyMessage = document.createElement('p');
            emptyMessage.className = 'empty-message';
            emptyMessage.textContent = 'No records found matching your search criteria.';
            searchResults.appendChild(emptyMessage);
        }
    }

    // Clear search
    function clearSearch() {
        // Clear search inputs
        searchCourseId.value = '';
        searchCourseName.value = '';
        searchFacultyEmail.value = '';
        
        // Reset date range (last 30 days)
        const today = new Date();
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(today.getDate() - 30);
        
        searchDateTo.valueAsDate = today;
        searchDateFrom.valueAsDate = thirtyDaysAgo;
        
        // Reset dropdowns
        searchIssueType.value = '';
        searchStatus.value = '';
        
        // Clear search results
        searchResults.innerHTML = '<p class="empty-message">No records found. Please search for courses.</p>';
        
        // Disable export button
        exportCsvBtn.disabled = true;
        
        // Clear app state
        appState.searchResults = [];
    }

    // Export search results to CSV
    function exportSearchResultsToCsv() {
        // Check if there are any results
        if (appState.searchResults.length === 0) {
            alert('No results to export.');
            return;
        }
        
        // Create CSV content
        let csvContent = 'Course ID,Course Name,Faculty Email,Last Evaluation,Total Issues,Open Issues\n';
        
        appState.searchResults.forEach(result => {
            csvContent += `${result.courseId},${result.courseName},${result.facultyEmail},${result.lastEvaluation.toLocaleDateString()},${result.totalIssues},${result.openIssues}\n`;
        });
        
        // Create and download the CSV file
        downloadCsv(csvContent, 'course_search_results.csv');
    }

    // View course details
    function viewCourseDetails(courseId) {
        // Show loading indicator
        courseStructure.innerHTML = '<p class="loading-message">Loading course details...</p>';
        
        // Find the course in search results
        const course = appState.searchResults.find(result => result.courseId === courseId);
        
        if (course) {
            // Update app state
            appState.currentCourseDetails = course;
            
            // Update UI
            courseDetailsHeader.textContent = `Course Details: ${course.courseName}`;
            detailsCourseId.textContent = course.courseId;
            detailsCourseName.textContent = course.courseName;
            detailsFacultyEmail.textContent = course.facultyEmail;
            detailsLastEvaluation.textContent = course.lastEvaluation.toLocaleDateString();
            detailsTotalIssues.textContent = course.totalIssues;
            detailsOpenIssues.textContent = course.openIssues;
            
            // Get course structure
            getCourseStructure(courseId)
                .then(structure => {
                    // Update app state
                    appState.currentCourseStructure = structure;
                    
                    // Display course structure
                    displayCourseStructure(structure);
                })
                .catch(error => {
                    courseStructure.innerHTML = `<p class="error-message">Error loading course structure: ${error.message}</p>`;
                });
            
            // Navigate to course details screen
            navigateToScreen(courseDetailsScreen);
        } else {
            alert(`Course with ID ${courseId} not found.`);
        }
    }

    // Get course structure
    function getCourseStructure(courseId) {
        return new Promise((resolve, reject) => {
            // This is a placeholder for the actual SharePoint query code
            // In a real implementation, you would use the SharePoint REST API
            
            // Example code for querying SharePoint (not functional in this demo):
            /*
            const siteUrl = "https://maristcollege.sharepoint.com/sites/CourseIssueTracker";
            
            // Get units
            fetch(`${siteUrl}/_api/web/lists/getbytitle('Units')/items?$select=Id,Title,UnitID,UnitNumber&$filter=CourseID eq '${courseId}'&$orderby=UnitNumber`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json;odata=verbose'
                }
            })
            .then(response => response.json())
            .then(data => {
                const units = data.d.results.map(unit => ({
                    id: unit.Id,
                    unitId: unit.UnitID,
                    name: unit.Title,
                    number: unit.UnitNumber,
                    folders: []
                }));
                
                // Get folders for each unit
                const folderPromises = units.map(unit => {
                    return fetch(`${siteUrl}/_api/web/lists/getbytitle('Folders')/items?$select=Id,Title,FolderID&$filter=UnitID eq '${unit.unitId}'`, {
                        method: 'GET',
                        headers: {
                            'Accept': 'application/json;odata=verbose'
                        }
                    })
                    .then(response => response.json())
                    .then(data => {
                        unit.folders = data.d.results.map(folder => ({
                            id: folder.Id,
                            folderId: folder.FolderID,
                            name: folder.Title,
                            files: []
                        }));
                        return unit;
                    });
                });
                
                return Promise.all(folderPromises);
            })
            .then(unitsWithFolders => {
                // Get files for each folder
                const filePromises = [];
                
                unitsWithFolders.forEach(unit => {
                    unit.folders.forEach(folder => {
                        filePromises.push(
                            fetch(`${siteUrl}/_api/web/lists/getbytitle('Files')/items?$select=Id,Title,FileID,FileType&$filter=FolderID eq '${folder.folderId}'`, {
                                method: 'GET',
                                headers: {
                                    'Accept': 'application/json;odata=verbose'
                                }
                            })
                            .then(response => response.json())
                            .then(data => {
                                folder.files = data.d.results.map(file => ({
                                    id: file.Id,
                                    fileId: file.FileID,
                                    name: file.Title,
                                    type: file.FileType,
                                    issues: []
                                }));
                                return folder;
                            })
                        );
                    });
                });
                
                return Promise.all(filePromises).then(() => unitsWithFolders);
            })
            .then(unitsWithFoldersAndFiles => {
                // Get issues for each file
                const issuePromises = [];
                
                unitsWithFoldersAndFiles.forEach(unit => {
                    unit.folders.forEach(folder => {
                        folder.files.forEach(file => {
                            issuePromises.push(
                                fetch(`${siteUrl}/_api/web/lists/getbytitle('IssueInstances')/items?$select=Id,Title,IssueTypeID,Status,Notes,DateIdentified&$expand=IssueTypeID&$filter=FileID eq '${file.fileId}'`, {
                                    method: 'GET',
                                    headers: {
                                        'Accept': 'application/json;odata=verbose'
                                    }
                                })
                                .then(response => response.json())
                                .then(data => {
                                    file.issues = data.d.results.map(issue => ({
                                        id: issue.Id,
                                        name: issue.IssueTypeID.Title,
                                        description: issue.IssueTypeID.Description,
                                        status: issue.Status,
                                        notes: issue.Notes,
                                        date: new Date(issue.DateIdentified)
                                    }));
                                    return file;
                                })
                            );
                        });
                    });
                });
                
                return Promise.all(issuePromises).then(() => unitsWithFoldersAndFiles);
            })
            .then(courseStructure => {
                resolve(courseStructure);
            })
            .catch(error => {
                reject(error);
            });
            */
            
            // For demo purposes, we'll just return mock data after a delay
            setTimeout(() => {
                // Generate a random course structure
                const unitCount = Math.floor(Math.random() * 5) + 3; // 3-7 units
                const units = [];
                
                for (let i = 0; i < unitCount; i++) {
                    const folderCount = Math.floor(Math.random() * 3) + 2; // 2-4 folders
                    const folders = [];
                    
                    for (let j = 0; j < folderCount; j++) {
                        const fileCount = Math.floor(Math.random() * 5) + 3; // 3-7 files
                        const files = [];
                        
                        for (let k = 0; k < fileCount; k++) {
                            const issueCount = Math.floor(Math.random() * 3); // 0-2 issues
                            const issues = [];
                            
                            for (let l = 0; l < issueCount; l++) {
                                // Get a random issue type
                                const issueType = issueTypes[Math.floor(Math.random() * issueTypes.length)];
                                
                                // Generate a random date within the last 30 days
                                const now = new Date();
                                const thirtyDaysAgo = new Date();
                                thirtyDaysAgo.setDate(now.getDate() - 30);
                                const issueDate = new Date(thirtyDaysAgo.getTime() + Math.random() * (now.getTime() - thirtyDaysAgo.getTime()));
                                
                                // Generate a random status
                                const statuses = ['Open', 'In Progress', 'Resolved', 'Closed'];
                                const status = statuses[Math.floor(Math.random() * statuses.length)];
                                
                                issues.push({
                                    id: `I${i}${j}${k}${l}`,
                                    name: issueType.name,
                                    description: issueType.description,
                                    status: status,
                                    notes: `Sample notes for ${issueType.name} issue.`,
                                    date: issueDate
                                });
                            }
                            
                            files.push({
                                id: `F${i}${j}${k}`,
                                fileId: `FILE${i}${j}${k}`,
                                name: `File ${k + 1}`,
                                type: `Custom File Type ${k + 1}`,
                                issues: issues
                            });
                        }
                        
                        folders.push({
                            id: `FD${i}${j}`,
                            folderId: `FOLDER${i}${j}`,
                            name: `Folder ${j + 1}`,
                            files: files
                        });
                    }
                    
                    units.push({
                        id: `U${i}`,
                        unitId: `UNIT${i}`,
                        name: `Unit ${i + 1}`,
                        number: i + 1,
                        folders: folders
                    });
                }
                
                resolve(units);
            }, 1500);
        });
    }

    // Display course structure
    function displayCourseStructure(structure) {
        // Clear the course structure
        courseStructure.innerHTML = '';
        
        // Add each unit
        structure.forEach(unit => {
            // Clone the unit structure template
            const unitNode = document.importNode(unitStructureTemplate.content, true);
            const unitStructure = unitNode.querySelector('.structure-unit');
            
            // Get unit elements
            const unitName = unitStructure.querySelector('.unit-name');
            const toggleBtn = unitStructure.querySelector('.toggle-btn');
            const structureContent = unitStructure.querySelector('.structure-content');
            
            // Set unit data
            unitName.textContent = `${unit.name} (Unit ${unit.number})`;
            
            // Add event listener for toggle button
            toggleBtn.addEventListener('click', function() {
                structureContent.classList.toggle('open');
                const icon = this.querySelector('i');
                icon.classList.toggle('fa-chevron-down');
                icon.classList.toggle('fa-chevron-up');
            });
            
            // Add folders to the unit
            unit.folders.forEach(folder => {
                // Clone the folder structure template
                const folderNode = document.importNode(folderStructureTemplate.content, true);
                const folderStructure = folderNode.querySelector('.structure-folder');
                
                // Get folder elements
                const folderName = folderStructure.querySelector('.folder-name');
                const folderToggleBtn = folderStructure.querySelector('.toggle-btn');
                const folderContent = folderStructure.querySelector('.structure-content');
                
                // Set folder data
                folderName.textContent = folder.name;
                
                // Add event listener for toggle button
                folderToggleBtn.addEventListener('click', function() {
                    folderContent.classList.toggle('open');
                    const icon = this.querySelector('i');
                    icon.classList.toggle('fa-chevron-down');
                    icon.classList.toggle('fa-chevron-up');
                });
                
                // Add files to the folder
                folder.files.forEach(file => {
                    // Clone the file structure template
                    const fileNode = document.importNode(fileStructureTemplate.content, true);
                    const fileStructure = fileNode.querySelector('.structure-file');
                    
                    // Get file elements
                    const fileName = fileStructure.querySelector('.file-name');
                    const fileType = fileStructure.querySelector('.file-type');
                    const fileToggleBtn = fileStructure.querySelector('.toggle-btn');
                    const fileContent = fileStructure.querySelector('.structure-content');
                    
                    // Set file data
                    fileName.textContent = file.name;
                    fileType.textContent = file.type;
                    
                    // Add event listener for toggle button
                    fileToggleBtn.addEventListener('click', function() {
                        fileContent.classList.toggle('open');
                        const icon = this.querySelector('i');
                        icon.classList.toggle('fa-chevron-down');
                        icon.classList.toggle('fa-chevron-up');
                    });
                    
                    // Add issues to the file
                    if (file.issues.length > 0) {
                        file.issues.forEach(issue => {
                            // Clone the issue structure template
                            const issueNode = document.importNode(issueStructureTemplate.content, true);
                            const issueStructure = issueNode.querySelector('.structure-issue');
                            
                            // Get issue elements
                            const issueName = issueStructure.querySelector('.issue-name');
                            const issueStatus = issueStructure.querySelector('.issue-status');
                            const issueDescription = issueStructure.querySelector('.issue-description');
                            const issueNotes = issueStructure.querySelector('.issue-notes');
                            const issueDate = issueStructure.querySelector('.issue-date');
                            
                            // Set issue data
                            issueName.textContent = issue.name;
                            issueStatus.textContent = issue.status;
                            issueDescription.textContent = `Description: ${issue.description}`;
                            issueNotes.textContent = `Notes: ${issue.notes}`;
                            issueDate.textContent = `Identified: ${issue.date.toLocaleDateString()}`;
                            
                            // Add status class
                            issueStatus.classList.add(`status-${issue.status.toLowerCase().replace(' ', '-')}`);
                            
                            // Add the issue to the file
                            fileContent.appendChild(issueStructure);
                        });
                    } else {
                        // Show no issues message
                        const noIssuesMessage = document.createElement('p');
                        noIssuesMessage.className = 'empty-message';
                        noIssuesMessage.textContent = 'No issues found for this file.';
                        fileContent.appendChild(noIssuesMessage);
                    }
                    
                    // Add the file to the folder
                    folderContent.appendChild(fileStructure);
                });
                
                // Add the folder to the unit
                structureContent.appendChild(folderStructure);
            });
            
            // Add the unit to the course structure
            courseStructure.appendChild(unitStructure);
        });
    }

    // Export course details to CSV
    function exportCourseDetailsToCsv() {
        // Check if there is a current course
        if (!appState.currentCourseDetails || !appState.currentCourseStructure) {
            alert('No course details to export.');
            return;
        }
        
        // Create CSV content
        let csvContent = 'Unit,Folder,File,File Type,Issue,Status,Notes,Date Identified\n';
        
        appState.currentCourseStructure.forEach(unit => {
            unit.folders.forEach(folder => {
                folder.files.forEach(file => {
                    if (file.issues.length > 0) {
                        file.issues.forEach(issue => {
                            csvContent += `"${unit.name}","${folder.name}","${file.name}","${file.type}","${issue.name}","${issue.status}","${issue.notes}","${issue.date.toLocaleDateString()}"\n`;
                        });
                    } else {
                        csvContent += `"${unit.name}","${folder.name}","${file.name}","${file.type}","No issues","","",""\n`;
                    }
                });
            });
        });
        
        // Create and download the CSV file
        downloadCsv(csvContent, `course_details_${appState.currentCourseDetails.courseId}.csv`);
    }

    // Download CSV
    function downloadCsv(csvContent, fileName) {
        // Create a blob with the CSV content
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        
        // Create a download link
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', fileName);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // Navigate to search screen
    function navigateToSearch() {
        navigateToScreen(searchScreen);
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
