import yt_dlp

def baixar_musica(url):
    opcoes = {
        'format': 'bestaudio/best',
        'outtmpl': 'musicas/%(title)s.%(ext)s',
        'postprocessors': [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'mp3',
            'preferredquality': '192',
        }],
    }

    with yt_dlp.YoutubeDL(opcoes) as ydl:
        ydl.download([url])


url = "https://www.youtube.com/watch?v=jtBmowJLc94&list=RDjtBmowJLc94&start_radio=1"
baixar_musica(url)