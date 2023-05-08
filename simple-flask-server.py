from flask import Flask, send_file, send_from_directory
from flask_cors import CORS
import pydicom
from PIL import Image
import io
import numpy as np
import os

app = Flask(__name__, static_folder='./src/assets/dicoms')
CORS(app)


@app.route('/thumbnail/<string:image_name>')
def get_thumbnail(image_name):
    dataset = pydicom.dcmread(os.path.join(
        app.static_folder, f"{image_name}.dcm"))

    # Normalize DICOM data
    image_2d = dataset.pixel_array.astype(float)
    image_2d_scaled = (np.maximum(image_2d, 0) / image_2d.max()) * 255.0
    image_2d_scaled = np.uint8(image_2d_scaled)

    # Create a PIL image
    im = Image.fromarray(image_2d_scaled)

    # Convert the image to grayscale
    # im = im.convert('L')

    # Create thumbnail
    size = (300, 300)
    im.thumbnail(size)

    # Convert PIL image to byte array
    byte_arr = io.BytesIO()
    im.save(byte_arr, format='PNG')
    byte_arr = byte_arr.getvalue()

    return send_file(
        io.BytesIO(byte_arr),
        mimetype='image/png',
        as_attachment=True,
        download_name='%s.png' % image_name
    )


@app.route('/<path:path>')
def serve_file(path):
    return send_from_directory(app.static_folder, path)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)
