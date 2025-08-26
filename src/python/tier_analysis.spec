# -*- mode: python ; coding: utf-8 -*-


a = Analysis(
    ['tier_analysis.py'],
    pathex=[],
    binaries=[],
    datas=[],
    hiddenimports=[
        'matplotlib.backends.backend_svg',
        'distributed.http.scheduler',
        'distributed.http.scheduler.prometheus',
        'distributed.http.scheduler.info',
        'distributed.http.scheduler.json',
        'distributed.http.health',
        'distributed.http.proxy',
        'distributed.http.statics',
        'distributed.http.worker',
        'distributed.http.worker.prometheus'
    ],
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[],
    noarchive=True,
    optimize=0,
)
pyz = PYZ(a.pure)

exe = EXE(
    pyz,
    a.scripts,
    a.binaries,
    a.datas,
    [],
    name='tier_analysis_app_IsaacUtah1379',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    upx_exclude=[],
    runtime_tmpdir=None,
    console=True,
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
)
