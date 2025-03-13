# Open Logo Generator

An AI-powered logo generator leveraging OpenAI's state-of-the-art models to create logos across different categories and manipulate images using Replicate models.

This repository aims to provide the simplest implementation of a logo generator application and serve as a sandbox for developers to explore and learn from.

[![Twitter Follow](https://img.shields.io/twitter/follow/ajaga_abdbasit?style=social)](https://x.com/ajaga_abdbasit)
[![YouTube Channel](https://img.shields.io/badge/YouTube-Subscribe-red)](https://www.youtube.com/@thefatprogrammer)

## Quick Introduction

Watch a quick demo of the application in action:

[![Demo Video](https://img.shields.io/badge/Demo-Watch%20Now-blue)](https://x.com/ajaga_abdbasit/status/1810433588174971334)

## Features

- **AI-Powered Logo Generation**: Create professional logos for various industries and purposes
- **Image Manipulation**: Transform existing logos and images using advanced AI models
- **User-Friendly Interface**: Simple and intuitive design for seamless user experience
- **Customization Options**: Adjust style, colors, and design elements

## Showcase

### Logo Generation Samples

<table>
  <tr>
    <td><img src="https://pbs.twimg.com/media/GSMcGVtXIAAPe24?format=jpg&name=large" width="200"/></td>
    <td><img src="https://pbs.twimg.com/media/GSHrJCiWsAE0Son?format=jpg&name=medium" width="200"/></td>
  </tr>
</table>

More examples from our community:

<table>
  <tr>
    <td><img src="https://app.owlai.art/_next/image?url=https%3A%2F%2Futfs.io%2Ff%2F7f8505b0-d8bf-43de-9288-7f966f57bb88-h31vdf.png&w=3840&q=100" width="150"/></td>
    <td><img src="https://app.owlai.art/_next/image?url=https%3A%2F%2Futfs.io%2Ff%2Fd601c80f-a445-4f18-98c4-c763a47ff4bd-1k5mzc.png&w=3840&q=100" width="150"/></td>
    <td><img src="https://app.owlai.art/_next/image?url=https%3A%2F%2Futfs.io%2Ff%2F62eb7343-a003-4a49-b8c6-ea87886dbbdc-n88i13.png&w=3840&q=100" width="150"/></td>
    <td><img src="https://app.owlai.art/_next/image?url=https%3A%2F%2Futfs.io%2Ff%2F7bf7b430-2a45-4d48-b766-df2289ba1077-m1jvlg.png&w=3840&q=100" width="150"/></td>
  </tr>
  <tr>
    <td><img src="https://app.owlai.art/_next/image?url=https%3A%2F%2Futfs.io%2Ff%2Fdcfb94db-b4ee-4054-92c1-28b7179be532-isrdm9.png&w=3840&q=100" width="150"/></td>
    <td><img src="https://app.owlai.art/_next/image?url=https%3A%2F%2Futfs.io%2Ff%2F4e1d4862-b42a-47e4-a22c-342cfd4bb0f7-1m4o63.png&w=3840&q=100" width="150"/></td>
    <td><img src="https://app.owlai.art/_next/image?url=https%3A%2F%2Futfs.io%2Ff%2Fde5b8450-d676-40f5-b691-510845632020-uf9tj8.png&w=3840&q=100" width="150"/></td>
    <td><img src="https://app.owlai.art/_next/image?url=https%3A%2F%2Futfs.io%2Ff%2Fbdf65946-924d-4d9b-983d-9b5d5462b7bb-416jpi.png&w=3840&q=100" width="150"/></td>
  </tr>
</table>

[Explore more in our Owlai community gallery →](https://app.owlai.art/community)

### Image Manipulation Examples

#### MKBHD Transformation

<table>
  <tr>
    <td>Original</td>
    <td>Transformed</td>
  </tr>
  <tr>
    <td><img src="https://pbs.twimg.com/media/GR_q9-6W4AAkifp?format=png&name=small" width="200"/></td>
    <td><img src="https://pbs.twimg.com/media/GR_rC2iboAAk3nF?format=jpg&name=medium" width="200"/></td>
  </tr>
</table>

#### My Friend Dillion

<table>
  <tr>
    <td>Original</td>
    <td>Transformed</td>
  </tr>
  <tr>
    <td><img src="https://pbs.twimg.com/media/GR_rM0UXcAE3vWz?format=jpg&name=small" width="200"/></td>
    <td><img src="https://pbs.twimg.com/media/GR_rM0tW0AAZs09?format=jpg&name=medium" width="200"/></td>
  </tr>
</table>

#### Elon Musk

<table>
  <tr>
    <td>Original</td>
    <td>Transformed</td>
  </tr>
  <tr>
    <td><img src="https://pbs.twimg.com/media/GR_qtnibMAAPgy6?format=jpg&name=900x900" width="200"/></td>
    <td><img src="https://pbs.twimg.com/media/GR_qttXXkAAbjD4?format=jpg&name=medium" width="200"/></td>
  </tr>
</table>

## Installation

### Prerequisites

- Node.js (Latest LTS version recommended)
- npm or yarn package manager
- API keys for required services

### Setup Instructions

1. Clone the repository:

   ```bash
   git clone https://github.com/ajagatobby/open-owlai.git
   cd open-owlai
   ```

2. Install dependencies:

   ```bash
   npm install
   # or with yarn
   yarn install
   ```

3. Set up external services:

   - **Supabase**

     - Create an account at [Supabase](https://supabase.com)
     - Create a new project and copy your API keys
     - Configure authentication by enabling Google sign-in in the Auth section

   - **API Keys**

     - Get your API key from [OpenAI](https://platform.openai.com)
     - Get your API key from [Replicate](https://replicate.com)

   - **Payment Processing**
     - Set up payment with [Paddle](https://paddle.com) (primary)
     - Alternative: [Stripe](https://stripe.com) integration is also supported

4. Configure environment variables:
   - Create a `.env.local` file in the project root
   - Add your API keys and configuration variables

## Usage

1. Start the development server:

   ```bash
   npm run dev
   # or with yarn
   yarn dev
   ```

2. Open your browser and navigate to `http://localhost:3000`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Connect

[![Twitter Follow](https://img.shields.io/twitter/follow/ajaga_abdbasit?style=social)](https://x.com/ajaga_abdbasit)
[![YouTube Channel](https://img.shields.io/badge/YouTube-Subscribe-red)](https://www.youtube.com/@thefatprogrammer)

---

⭐ If you find this project useful, please consider giving it a star on GitHub! ⭐
