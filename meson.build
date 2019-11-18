project('apps-to-panel',
  version: '19.10.0',
  license: 'GPL3'
)

gnome = import ('gnome')
i18n = import('i18n')

prefix = get_option('prefix')
datadir = join_paths (prefix, get_option('datadir'))
schema_dir = join_paths(datadir, 'glib-2.0', 'schemas')

extensions_dir = join_paths(prefix, 'share', 'gnome-shell', 'extensions', 'apps-to-panel@leavitals')

install_data([
    'prefs.js',
    'extension.js',
    'metadata.json',
    'stylesheet.css'
  ],
  install_dir: extensions_dir
)

subdir(
  'po'
)
subdir(
  'schemas'
)

meson.add_install_script('meson_post_install.py')
