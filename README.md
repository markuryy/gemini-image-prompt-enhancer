# AI Prompt Enhancer

This is a Next.js project that uses the GROQ API to enhance AI prompts. It features a user-friendly interface built with Mantine UI components and supports various preset configurations for prompt enhancement.

## Features

- Next.js 13 with App Router for efficient, server-side rendered pages
- Mantine UI components for a sleek, responsive design
- TypeScript for type-safe code
- Integration with GROQ API for AI-powered prompt enhancement
- Customizable presets for different enhancement styles
- Dark mode support
- Responsive layout that works on both desktop and mobile devices

## Project Structure

- `src/app`: Contains the main application pages and layouts
- `src/components`: Reusable React components
- `src/data`: JSON data files for presets
- `src/utils`: Utility functions for API key and preset management
- `public`: Static assets

## Getting Started

1. Clone the repository:
   ```
   git clone https://github.com/markuryy/prompt-enhancer.git
   cd ai-prompt-enhancer
   ```

2. Install dependencies:
   ```
   bun install
   ```

3. Set up your GROQ API key:
   - Sign up for a GROQ API key at [https://www.groq.com/](https://www.groq.com/)
   - You'll be prompted to enter your API key when you first run the application

4. Run the development server:
   ```
   bun dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Usage

1. Enter your prompt in the text area.
2. Select a preset from the dropdown menu.
3. Click the "Enhance" button to generate an improved version of your prompt.
4. Use the "Undo" button to revert to the previous version if needed.

## Contributing Presets

We welcome contributions to expand our collection of presets. To add a new preset:

1. Fork the repository and create a new branch for your preset.
2. Open the `src/data/presets.json` file.
3. Add your new preset to the JSON object. The key should be the name of your preset, and the value should be the system prompt for the AI:

   ```json
   {
     "ExistingPreset1": "Existing preset content...",
     "ExistingPreset2": "Existing preset content...",
     "YourNewPreset": "Your new preset system prompt here..."
   }
   ```

4. Commit your changes and create a pull request.

Please ensure your preset is appropriate and does not contain any offensive or inappropriate content.

## Customization

- Modify the Mantine theme in `src/components/layout/AppLayout.tsx` to customize the overall look and feel.
- Add new pages in the `src/app` directory following Next.js 13 conventions.
- Extend functionality by adding new components in the `src/components` directory.

## Learn More

To learn more about the technologies used in this project, check out the following resources:

- [Next.js Documentation](https://nextjs.org/docs)
- [Mantine Documentation](https://mantine.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [GROQ API Documentation](https://www.groq.com/docs/)

## Deployment

This project is ready to be deployed on [Vercel](https://vercel.com/), the platform from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## License

This project is open source and available under the [MIT License](LICENSE).
