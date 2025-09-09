import cairosvg
import os

svg_path = os.path.join('client', 'public', 'logo.svg')
png_path = os.path.join('client', 'public', 'logo-192.png')

cairosvg.svg2png(url=svg_path, write_to=png_path, output_width=192, output_height=192)

print(f"Successfully converted {svg_path} to {png_path}")
