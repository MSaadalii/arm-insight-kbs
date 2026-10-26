from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from functools import partial
from pathlib import Path
import argparse
class Handler(SimpleHTTPRequestHandler):
    extensions_map = {**SimpleHTTPRequestHandler.extensions_map, '.mjs':'text/javascript'}
if __name__ == '__main__':
    parser=argparse.ArgumentParser()
    parser.add_argument('--port',type=int,default=8000)
    args=parser.parse_args()
    try:
        with ThreadingHTTPServer(('127.0.0.1',args.port),partial(Handler,directory=str(Path(__file__).parent/'dist'))) as server:
            print(f'Open http://localhost:{args.port} — Ctrl+C to stop.',flush=True)
            server.serve_forever()
    except KeyboardInterrupt:
        print('Stopped.')
    except OSError as error:
        print(f'Cannot start: {error}. Try --port 8001')
