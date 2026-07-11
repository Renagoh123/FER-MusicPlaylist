from pathlib import Path
import kaggle

project_root = Path(__file__).parent.parent

kaggle.api.authenticate()

print(kaggle.api.dataset_list_files('msambare/fer2013').files)

out_dir = project_root / 'data'
out_dir.mkdir(exist_ok=True)

kaggle.api.dataset_download_files('msambare/fer2013', path=str(out_dir), unzip=True)