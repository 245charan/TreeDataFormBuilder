// Sample issue types data
const issueTypes = [
    {
        id: 1,
        name: "Missing Content",
        description: "Required content is missing from the file",
        severity: "High"
    },
    {
        id: 2,
        name: "Broken Link",
        description: "Link in the content does not work or points to incorrect location",
        severity: "High"
    },
    {
        id: 3,
        name: "Outdated Information",
        description: "Content contains information that is no longer current or accurate",
        severity: "Medium"
    },
    {
        id: 4,
        name: "Formatting Error",
        description: "Content has incorrect formatting, layout issues, or styling problems",
        severity: "Low"
    },
    {
        id: 5,
        name: "Accessibility Issue",
        description: "Content does not meet accessibility standards or guidelines",
        severity: "High"
    },
    {
        id: 6,
        name: "Spelling/Grammar Error",
        description: "Content contains spelling mistakes or grammatical errors",
        severity: "Low"
    },
    {
        id: 7,
        name: "Incorrect Assessment",
        description: "Assessment questions or answers are incorrect or misaligned with objectives",
        severity: "High"
    },
    {
        id: 8,
        name: "Media Issue",
        description: "Images, videos, or audio files are missing, broken, or poor quality",
        severity: "Medium"
    },
    {
        id: 9,
        name: "Navigation Problem",
        description: "Course navigation is confusing, inconsistent, or broken",
        severity: "Medium"
    },
    {
        id: 10,
        name: "Inconsistent Terminology",
        description: "Terminology used is inconsistent across course materials",
        severity: "Low"
    },
    {
        id: 11,
        name: "Missing Instructions",
        description: "Instructions for activities or assessments are unclear or missing",
        severity: "Medium"
    },
    {
        id: 12,
        name: "Copyright Violation",
        description: "Content may violate copyright or lacks proper attribution",
        severity: "High"
    },
    {
        id: 13,
        name: "Broken Interactive Element",
        description: "Interactive elements like quizzes or simulations don't function properly",
        severity: "High"
    },
    {
        id: 14,
        name: "Alignment Issue",
        description: "Content doesn't align with stated learning objectives",
        severity: "Medium"
    },
    {
        id: 15,
        name: "Duplicate Content",
        description: "Same content appears multiple times unnecessarily",
        severity: "Low"
    },
    {
        id: 16,
        name: "Incorrect Sequencing",
        description: "Content is presented in an illogical or pedagogically unsound sequence",
        severity: "Medium"
    },
    {
        id: 17,
        name: "Technical Error",
        description: "Technical issues prevent content from functioning as intended",
        severity: "High"
    },
    {
        id: 18,
        name: "Incomplete Assessment",
        description: "Assessment is missing components or doesn't fully measure objectives",
        severity: "Medium"
    },
    {
        id: 19,
        name: "Outdated Reference",
        description: "References to tools, systems, or resources that are outdated",
        severity: "Medium"
    },
    {
        id: 20,
        name: "Inconsistent Design",
        description: "Visual design elements are inconsistent with course standards",
        severity: "Low"
    },
    {
        id: 21,
        name: "Missing Metadata",
        description: "Required metadata for the file or content is missing",
        severity: "Low"
    },
    {
        id: 22,
        name: "Compliance Issue",
        description: "Content doesn't comply with institutional policies or regulations",
        severity: "High"
    }
];
