# Petcare.uz Frontend

Petcare.uz is a web application for pet adoption, rehoming, and pet care services. This repository contains the frontend, built with HTML, CSS, and JavaScript, offering an interactive user interface for pet lovers.

Official website link: https://abdusamadsherkulov.github.io/petcare.uz/

## Table of Contents

- [Features](#features)
- [Technologies](#technologies)
- [Setup](#setup)
- [Deployment](#deployment)
- [Usage](#usage)
- [Contributing](#contributing)

## Features

- **Adoption Page:** Browse and adopt pets with a cart system.
- **Rehoming:** Submit pets for rehoming with photo uploads.
- **Cart System:** Add/remove pets from a user-specific cart.
- **Pricing Section:** Displays deals like "First 2 Adoptions Free."
- **Multilingual:** Supports English, Russian, and Uzbek via `languages.json`.
- **Responsive Design:** Works on desktop and mobile.

## Technologies

- HTML5
- CSS3 (with Flexbox for responsive layouts)
- JavaScript (ES6+, Fetch API for backend communication)
- Remixicon for icons
- LocalStorage for token management
- Some buttons and cards are taken from uiverse.io
- Google font used

## Setup

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/abdusamadsherkulov/petcare.uz.git
   cd petcare
   ```

## Deployment

Deployed on [github] at: https://abdusamadsherkulov.github.io/petcare.uz/
Steps:
Push to GitHub.
Connect repository to hosting platform.
Set build command to none (static site) and output directory to /.

## Usage

Login: Access via login-page.html to get a JWT token.
Adopt Pets: Visit adoption.html, add pets to cart.
Rehome Pets: Submit via rehoming form on rehome.pet.html (requires login).
View Shop Items: Visit pet-items.html
View Profile: Visit profile.html
View Pet Profile: Visit pet-profile.html
View Cart: Check cart.html to manage cart items.
Pricing: See deals on index.html#pricing.

## Contributing

Fork the repo, create a branch, and submit a pull request with your changes.
Report issues via GitHub Issues.
