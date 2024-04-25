import requests

spreadsheet="https://rtucloud1-my.sharepoint.com/:x:/g/personal/skola_rtu_lv/ET9xK7cPh_1KiD6ql3-pcrsBCN1imdNpeyd9VYfYicPOrw?download=1"
    
def download(url: str, filename: str) -> None:
    try:
        response = requests.get(url, stream=True)
        with open(filename, 'wb') as f:
            for data in response.iter_content(1024):
                f.write(data)
    except Exception as e:
        raise(e)

if __name__ == "__main__":
    download(url=spreadsheet, filename="timetable.xlsx")