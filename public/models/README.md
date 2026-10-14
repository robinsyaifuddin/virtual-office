# Petunjuk Menaruh File Model 3D Realistis (.GLB / .GLTF)

Direktori ini (`frontend/public/models/`) disediakan khusus untuk menampung file model 3D nyata jika Anda ingin menggunakan model 3D kustom dari Mixamo, Ready Player Me, Sketchfab, atau Kenney.nl:

1. **Model Gedung Kantor Lengkap**:
   - Taruh file: `digibooster_office.glb`
   - Dalam kode React Three Fiber (`Office3D.jsx`), panggil dengan:
     ```jsx
     const { scene } = useGLTF('/models/digibooster_office.glb');
     return <primitive object={scene} />;
     ```

2. **Model Karakter Orang Realistis (Mixamo / Ready Player Me)**:
   - Taruh file: `agent_human.glb` (lengkap dengan skeleton rigging & animasi).
   - Dalam kode React Three Fiber:
     ```jsx
     const { scene, animations } = useGLTF('/models/agent_human.glb');
     const { actions } = useAnimations(animations, scene);
     useEffect(() => {
       actions['Typing']?.play(); // Animasi mengetik
     }, []);
     return <primitive object={scene} position={[x, y, z]} />;
     ```

Format `.glb` adalah standar industri web 3D yang ringan, cepat dimuat di shared hosting, dan mendukung tekstur PBR berkualitas tinggi.
