# UPG Profile Image Generator

Quick and easy tool to generate UPG profile images using AI, then save them locally in the correct folder structure.

## Setup

1. **Install Python dependencies:**
```bash
pip install -r requirements.txt
```

2. **Run the server:**
```bash
python app.py
```

3. **Open your browser:**
Go to http://localhost:5000

## How to Use

1. Click **Start Generation**
2. Wait for images to generate (5 at a time in parallel)
3. Click your favorite image from each set
4. Images automatically save to `output/upg-resources/images/upg-profiles/{country}/{religion}/{gender}.jpg`
5. Next batch starts automatically

## Features

- **Fast:** Generates 5 UPG profiles simultaneously
- **Simple:** Click to select, auto-saves to correct folders
- **Progress tracking:** Remembers what you've completed
- **Auto-organizing:** Creates folder structure automatically

## Output Structure

```
output/
└── upg-resources/
    └── images/
        └── upg-profiles/
            └── {country}/
                └── {religion}/
                    ├── male.jpg
                    └── female.jpg
```

## Controls

- **Start Generation:** Begin processing UPG profiles
- **Pause:** Pause the current batch
- **Reset Completed List:** Start fresh (doesn't delete saved images)
