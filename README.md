# OmniPost AI

An API-first platform to automate social media content publishing across multiple platforms with a single integration.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/automacoescomerciaisintegradas/OmniPost)

OmniPost AI is a sophisticated, API-first social media management platform designed for developers, creators, and agencies. It streamlines the process of content creation and distribution by allowing users to upload media (images, videos) and text to multiple social platforms like Facebook, Instagram, LinkedIn, and TikTok through a single, unified API call or a clean, intuitive web interface.

## Key Features

-   **Unified API**: Upload to multiple social platforms with a single API call.
-   **Profile Management**: Create and manage distinct profiles to group different sets of social media accounts.
-   **Intuitive Dashboard**: A clean interface for manually composing posts, uploading media, and selecting target platforms.
-   **Automation-Ready**: Automatically generates cURL commands from your dashboard actions for easy integration into workflows (n8n, Make.com, etc.).
-   **Secure API Keys**: Manage your API keys for programmatic access with ease.
-   **High Performance**: Built on Cloudflare's edge network for global speed and reliability.
-   **Modern UI/UX**: A visually stunning, responsive, and user-friendly interface built with shadcn/ui and Tailwind CSS.

## Technology Stack

-   **Frontend**: React, Vite, React Router, Tailwind CSS, shadcn/ui
-   **State Management**: Zustand
-   **Forms**: React Hook Form with Zod for validation
-   **Animations**: Framer Motion
-   **Backend**: Hono on Cloudflare Workers
-   **Storage**: Cloudflare Durable Objects
-   **Language**: TypeScript

## Getting Started

Follow these instructions to get the project up and running on your local machine for development and testing purposes.

### Prerequisites

-   [Node.js](https://nodejs.org/) (v20.x or later recommended)
-   [Bun](https://bun.sh/)
-   [Cloudflare Wrangler](https://developers.cloudflare.com/workers/wrangler/install-and-update/) CLI

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd omnipost-ai
    ```

2.  **Install dependencies:**
    This project uses Bun for package management.
    ```bash
    bun install
    ```

## Development

To start the local development server, which includes the Vite frontend and the Cloudflare Worker backend, run the following command:

```bash
bun dev
```

This will start the application, typically on `http://localhost:3000`. The frontend will hot-reload on changes, and the worker will restart automatically.

## Deployment

This project is designed for seamless deployment to Cloudflare's global network.

1.  **Build the application:**
    The deployment script handles the build process automatically.

2.  **Deploy to Cloudflare:**
    Run the following command to deploy your application using Wrangler:
    ```bash
    bun deploy
    ```

Alternatively, you can deploy directly from your GitHub repository using the button below.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/automacoescomerciaisintegradas/OmniPost)

## Project Structure

The codebase is organized into three main directories:

-   `src/`: Contains the entire React frontend application, including pages, components, hooks, and utility functions.
-   `worker/`: Contains the Hono backend application that runs on Cloudflare Workers. This is where API routes and business logic are defined.
-   `shared/`: Contains TypeScript types and interfaces that are shared between the frontend and the backend to ensure type safety across the stack.