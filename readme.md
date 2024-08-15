## Requirements

Before running this project, you need to set up the Kaggle API to download the GloVe dataset. Follow the instructions below to configure your Kaggle account.

### Setting Up Kaggle API

1. **Install Kaggle**: If you haven't already, install the Kaggle API using pip. Run the following command in your terminal:

   ```bash
   pip install kaggle
   ```
2. **Create a Kaggle Account**: If you don't have a Kaggle account, sign up at [Kaggle](https://www.kaggle.com).
3. **Generate Kaggle API Token**:

- Go to your Kaggle account settings.
- Scroll down to the "API" section and click on "Create New API Token."
- This will download a file named kaggle.json.

4. **Set Up Kaggle Directory**: Open your terminal and create a .kaggle directory by running:

    ```bash
    mkdir ~/.kaggle
    ```
5. **Move kaggle.json to the .kaggle Directory**: Move the downloaded kaggle.json file to the .kaggle directory. You can do this using the following command. 

    ```bash
    mv <path-to-downloads>/kaggle.json ~/.kaggle/
    chmod 600 ~/.kaggle/kaggle.json
    ```

6. **Then execute the bash script that downloads the GloVe .txt file**: 
    ```bash
    chmod +x download_glove.sh
    ./download_glove.sh
    ```
