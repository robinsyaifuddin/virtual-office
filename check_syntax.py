with open(r'frontend\public\digibooster_office_engine.html', 'r', encoding='utf-8') as f:
    text = f.read()

start_marker = '<script type="module">'
end_marker = '</script>'

s_idx = text.find(start_marker)
e_idx = text.find(end_marker, s_idx)

script_code = text[s_idx + len(start_marker):e_idx]

# Mock browser globals for syntax check
mock_header = """
const document = { querySelector: () => ({ appendChild: () => {}, querySelectorAll: () => [] }), createElement: () => ({ setAttribute: () => {}, style: {}, classList: { add: () => {}, remove: () => {} } }) };
const window = { addEventListener: () => {} };
const innerWidth = 1920;
const innerHeight = 1080;
const devicePixelRatio = 1;
const location = { hash: '', protocol: 'http:' };
const requestAnimationFrame = () => {};
const fetch = async () => ({ json: async () => ({ hosts: [] }) });
"""

with open('temp_check.js', 'w', encoding='utf-8') as f:
    # replace imports with mock to check syntax
    cleaned = script_code
    cleaned = cleaned.replace('import * as THREE from "three";', 'const THREE = {};')
    cleaned = cleaned.replace('import {OrbitControls} from "three/addons/controls/OrbitControls.js";', 'const OrbitControls = class {};')
    cleaned = cleaned.replace('import {CSS2DRenderer, CSS2DObject} from "three/addons/renderers/CSS2DRenderer.js";', 'const CSS2DRenderer = class {}; const CSS2DObject = class {};')
    cleaned = cleaned.replace('import {FontLoader} from "three/addons/loaders/FontLoader.js";', 'const FontLoader = class {};')
    cleaned = cleaned.replace('import {TextGeometry} from "three/addons/geometries/TextGeometry.js";', 'const TextGeometry = class {};')
    f.write(mock_header + cleaned)

print("temp_check.js written")
