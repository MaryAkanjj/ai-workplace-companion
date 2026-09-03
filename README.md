# AI Workplace Companion

Build a modern, clean and professional web application called AI Workplace Assistant. Purpose Create an AI-powered workplace productivity platform that helps employees, job seekers, students and professionals communicate effectively, summarize meetings and organize their work. The application must include at least these three fully functional AI tools:

Smart Email Generator Create an email-generation tool where the user can enter: Purpose of the email Recipient/audience Important information Desired tone Provide tone options: Formal Informal Persuasive Audience options: Manager Client Team member Colleague The AI should generate a clear and professional email based only on the information provided. Include: Generate Email button Clear loading state Generated email output Copy button Regenerate button Edit option

Meeting Notes Summarizer Create a tool where users can paste lengthy meeting notes. The AI should produce: A concise meeting summary Key points Decisions made Action items Person responsible for each action item, when stated Deadlines, when stated Do not invent information that is not present in the meeting notes. Include: Summarize button Loading state Clearly separated results Copy button Clear/reset button

AI Task Planner / Scheduler Create a tool where users can enter a list of tasks. Allow users to provide: Task name Deadline Estimated duration Priority The AI should: Organize tasks into a structured daily or weekly plan Prioritize tasks based on urgency and importance Suggest an efficient order for completing tasks Suggest time-management strategies Clearly identify high-priority tasks Include: Generate Plan button Daily/Weekly option Loading state Structured schedule output Copy button Reset button User Interface Create: A professional homepage/dashboard Navigation between the three AI tools Three clearly visible feature cards Simple forms for entering information Clear buttons Loading indicators Error messages Success/feedback messages Responsive design for mobile, tablet and desktop Responsible AI Include a visible notice: "AI-generated content should be reviewed by the user before being used. The AI may make mistakes or misunderstand information. Always verify important dates, names, decisions, deadlines and other details." The AI must: Use only information provided by the user Never invent facts, deadlines, responsibilities or decisions Clearly indicate when information is missing Encourage users to verify important outputs Design Use a clean, modern workplace style. Keep the interface simple and beginner-friendly. Use clear headings, icons and cards so users can easily understand what each tool does. Goal Create a functional prototype demonstrating three workplace AI solutions: Smart Email Generator Meeting Notes Summarizer AI Task Planner / Scheduler The final application should demonstrate useful AI functionality, clear prompt engineering, good user experience and responsible AI practices

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/546390d4-4b4e-4eca-8fee-3d5cc6eb5edb).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
