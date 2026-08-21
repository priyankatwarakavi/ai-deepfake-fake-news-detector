import os
import urllib.request
import zipfile
import shutil

ROOT_DIR = r"C:\Users\PRIYANKA\.gemini\antigravity\scratch\ai-deepfake-fake-news-detector"
NODE_DIR = os.path.join(ROOT_DIR, "node")
ZIP_URL = "https://nodejs.org/dist/v20.11.1/node-v20.11.1-win-x64.zip"
ZIP_PATH = os.path.join(ROOT_DIR, "node.zip")

def main():
    if not os.path.exists(ROOT_DIR):
        os.makedirs(ROOT_DIR)
        print(f"Created root directory: {ROOT_DIR}")

    node_exe = os.path.join(NODE_DIR, "node-v20.11.1-win-x64", "node.exe")
    if os.path.exists(node_exe):
        print(f"Node.exe already exists at: {node_exe}")
        return

    print(f"Downloading Node.js from {ZIP_URL}...")
    try:
        urllib.request.urlretrieve(ZIP_URL, ZIP_PATH)
        print("Download completed successfully.")
    except Exception as e:
        print(f"Failed to download Node.js: {e}")
        return

    print("Extracting Node.js zip archive...")
    try:
        with zipfile.ZipFile(ZIP_PATH, 'r') as zip_ref:
            zip_ref.extractall(NODE_DIR)
        print("Extraction completed successfully.")
    except Exception as e:
        print(f"Failed to extract Node.js: {e}")
        return
    finally:
        if os.path.exists(ZIP_PATH):
            os.remove(ZIP_PATH)
            print("Cleaned up download ZIP file.")

    if os.path.exists(node_exe):
        print(f"Successfully set up portable Node.js at: {node_exe}")
    else:
        print("Extraction completed, but node.exe was not found in expected path.")

if __name__ == "__main__":
    main()
