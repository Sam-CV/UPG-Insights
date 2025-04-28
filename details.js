// Initialize the details page
document.addEventListener('DOMContentLoaded', async function () {
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const groupId = urlParams.get('groupId');

    if (!groupId) {
        // Redirect to home if no groupId is present
        window.location.href = 'index.html';
        return;
    }

    // show the loading spinner
    loading(true);

    // Initialize the site components
    initializeSite();

    // Load the specific group details
    await loadGroupDetails(groupId);

});

// Load specific group details
async function loadGroupDetails(groupId) {
    try {
        loading(true);

        // First, fetch the basic group information from the database
        const groupSql = `SELECT * FROM upg_groups WHERE id = ${groupId}`;
        const groupData = await getData(groupSql);

        if (!groupData.rows || groupData.rows.length === 0) {
            // Group not found, redirect to home
            window.location.href = 'index.html';
            return;
        }

        const group = groupData.rows[0];

        // Set the group name in the title
        document.getElementById('group-name').textContent = group.name;

        // Define sections for display
        const sections = [
            { id: 'demographics', name: 'Demographics' },
            { id: 'digital-learnings', name: 'Digital Learnings' },
            { id: 'testimonies', name: 'Testimonies' },
            { id: 'external-resources', name: 'External Resources' }
        ];

        // Initialize section filters
        initializeSectionFilters(sections);

        // Immediately render the basic structure
        renderBasicStructureWithLoadingSkeletons(group);

        // Fetch research content for this group
        const contentSql = `SELECT * FROM upg_research_content WHERE group_id = ${groupId}`;
        const contentData = await getData(contentSql);

        // Organize content by section type
        const organizedContent = organizeContentBySectionType(contentData.rows);

        // Replace loading skeletons with actual content
        replaceLoadingSkeletonsWithContent(organizedContent, sections[0]);
        loading(false);

    } catch (error) {
        console.error('Error loading group details:', error);
        loading(false);
    }
}

// Add back button functionality
function addBackButton() {
    const titleSection = document.querySelector('.title-section');
    if (titleSection) {
        const backButton = document.createElement('a');
        backButton.href = 'index.html';
        backButton.className = 'back-button';
        backButton.innerHTML = `
            <span class="material-symbols-outlined">arrow_back</span>
            Back to Search
        `;
        titleSection.insertBefore(backButton, titleSection.firstChild);
    }
}

// Call addBackButton after the page loads
document.addEventListener('DOMContentLoaded', addBackButton);