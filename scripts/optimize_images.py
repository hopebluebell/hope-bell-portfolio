"""Create responsive WebP variants without modifying original project images."""
from pathlib import Path
from PIL import Image, ImageOps
import json, sys
source = Path(sys.argv[1])
target = Path(sys.argv[2])
target.mkdir(parents=True, exist_ok=True)
manifest = {}
for path in sorted(source.glob('*.jpg')):
    with Image.open(path) as original:
        image = ImageOps.exif_transpose(original).convert('RGB')
        variants=[]
        for width in sorted(set(min(w,image.width) for w in (480,960,1600))):
            height=round(image.height*width/image.width)
            name=f'{path.stem}-{width}.webp'
            image.resize((width,height),Image.Resampling.LANCZOS).save(target/name,'WEBP',quality=84,method=6)
            variants.append({'src':name,'width':width,'height':height,'bytes':(target/name).stat().st_size})
        manifest[path.stem]={'originalBytes':path.stat().st_size,'variants':variants}
(target/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2))
print(f'{len(manifest)} images; original JPEG total {sum(x["originalBytes"] for x in manifest.values())}; largest WebP total {sum(x["variants"][-1]["bytes"] for x in manifest.values())}')
