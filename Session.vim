let SessionLoad = 1
if &cp | set nocp | endif
let s:so_save = &so | let s:siso_save = &siso | set so=0 siso=0
let v:this_session=expand("<sfile>:p")
silent only
silent tabonly
exe "cd " . escape(expand("<sfile>:p:h"), ' ')
if expand('%') == '' && !&modified && line('$') <= 1 && getline(1) == ''
  let s:wipebuf = bufnr('%')
endif
set shortmess=aoO
argglobal
%argdel
$argadd ~/cursus/app/index.js
edit index.js
set splitbelow splitright
wincmd _ | wincmd |
vsplit
wincmd _ | wincmd |
vsplit
wincmd _ | wincmd |
vsplit
3wincmd h
wincmd _ | wincmd |
split
wincmd _ | wincmd |
split
wincmd _ | wincmd |
split
3wincmd k
wincmd w
wincmd w
wincmd w
wincmd w
wincmd _ | wincmd |
split
1wincmd k
wincmd w
wincmd w
wincmd _ | wincmd |
split
1wincmd k
wincmd w
wincmd w
wincmd _ | wincmd |
split
1wincmd k
wincmd w
wincmd t
set winminheight=0
set winheight=1
set winminwidth=0
set winwidth=1
exe '1resize ' . ((&lines * 22 + 47) / 94)
exe 'vert 1resize ' . ((&columns * 92 + 182) / 364)
exe '2resize ' . ((&lines * 22 + 47) / 94)
exe 'vert 2resize ' . ((&columns * 92 + 182) / 364)
exe '3resize ' . ((&lines * 22 + 47) / 94)
exe 'vert 3resize ' . ((&columns * 92 + 182) / 364)
exe '4resize ' . ((&lines * 21 + 47) / 94)
exe 'vert 4resize ' . ((&columns * 92 + 182) / 364)
exe '5resize ' . ((&lines * 44 + 47) / 94)
exe 'vert 5resize ' . ((&columns * 84 + 182) / 364)
exe '6resize ' . ((&lines * 45 + 47) / 94)
exe 'vert 6resize ' . ((&columns * 84 + 182) / 364)
exe '7resize ' . ((&lines * 45 + 47) / 94)
exe 'vert 7resize ' . ((&columns * 93 + 182) / 364)
exe '8resize ' . ((&lines * 44 + 47) / 94)
exe 'vert 8resize ' . ((&columns * 93 + 182) / 364)
exe '9resize ' . ((&lines * 45 + 47) / 94)
exe 'vert 9resize ' . ((&columns * 92 + 182) / 364)
exe '10resize ' . ((&lines * 44 + 47) / 94)
exe 'vert 10resize ' . ((&columns * 92 + 182) / 364)
argglobal
setlocal fdm=indent
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=5
setlocal fml=1
setlocal fdn=20
setlocal fen
11
normal! zo
let s:l = 8 - ((7 * winheight(0) + 11) / 22)
if s:l < 1 | let s:l = 1 | endif
exe s:l
normal! zt
8
normal! 029|
wincmd w
argglobal
if bufexists("routes/main.js") | buffer routes/main.js | else | edit routes/main.js | endif
setlocal fdm=indent
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=2
setlocal fml=1
setlocal fdn=20
setlocal fen
let s:l = 14 - ((10 * winheight(0) + 11) / 22)
if s:l < 1 | let s:l = 1 | endif
exe s:l
normal! zt
14
normal! 020|
wincmd w
argglobal
if bufexists("routes/api.js") | buffer routes/api.js | else | edit routes/api.js | endif
setlocal fdm=indent
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=3
setlocal fml=1
setlocal fdn=20
setlocal fen
let s:l = 3 - ((2 * winheight(0) + 11) / 22)
if s:l < 1 | let s:l = 1 | endif
exe s:l
normal! zt
3
normal! 0
wincmd w
argglobal
if bufexists("routes/login.js") | buffer routes/login.js | else | edit routes/login.js | endif
setlocal fdm=indent
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=2
setlocal fml=1
setlocal fdn=20
setlocal fen
let s:l = 16 - ((14 * winheight(0) + 10) / 21)
if s:l < 1 | let s:l = 1 | endif
exe s:l
normal! zt
16
normal! 021|
wincmd w
argglobal
if bufexists("routes/torrent.js") | buffer routes/torrent.js | else | edit routes/torrent.js | endif
setlocal fdm=indent
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=3
setlocal fml=1
setlocal fdn=20
setlocal fen
11
normal! zo
15
normal! zo
15
normal! zo
22
normal! zo
let s:l = 18 - ((17 * winheight(0) + 22) / 44)
if s:l < 1 | let s:l = 1 | endif
exe s:l
normal! zt
18
normal! 042|
wincmd w
argglobal
if bufexists("class/bencode.js") | buffer class/bencode.js | else | edit class/bencode.js | endif
setlocal fdm=indent
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=4
setlocal fml=1
setlocal fdn=20
setlocal fen
5
normal! zo
7
normal! zo
18
normal! zo
35
normal! zo
42
normal! zo
44
normal! zo
45
normal! zo
51
normal! zo
52
normal! zo
63
normal! zo
65
normal! zo
86
normal! zo
104
normal! zo
119
normal! zo
142
normal! zo
147
normal! zo
let s:l = 95 - ((33 * winheight(0) + 22) / 45)
if s:l < 1 | let s:l = 1 | endif
exe s:l
normal! zt
95
normal! 0
wincmd w
argglobal
if bufexists("class/bittorrent.js") | buffer class/bittorrent.js | else | edit class/bittorrent.js | endif
setlocal fdm=indent
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=3
setlocal fml=1
setlocal fdn=20
setlocal fen
9
normal! zo
11
normal! zo
37
normal! zo
37
normal! zo
37
normal! zo
38
normal! zo
41
normal! zo
45
normal! zo
47
normal! zo
52
normal! zo
57
normal! zo
57
normal! zo
63
normal! zo
68
normal! zo
71
normal! zo
75
normal! zo
let s:l = 16 - ((8 * winheight(0) + 22) / 45)
if s:l < 1 | let s:l = 1 | endif
exe s:l
normal! zt
16
normal! 0
wincmd w
argglobal
terminal ++curwin ++cols=93 ++rows=44 
setlocal fdm=indent
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=0
setlocal fml=1
setlocal fdn=20
setlocal fen
let s:l = 1 - ((0 * winheight(0) + 22) / 44)
if s:l < 1 | let s:l = 1 | endif
exe s:l
normal! zt
1
normal! 0
wincmd w
argglobal
if bufexists("static/js/app.js") | buffer static/js/app.js | else | edit static/js/app.js | endif
setlocal fdm=indent
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=7
setlocal fml=1
setlocal fdn=20
setlocal fen
2
normal! zo
3
normal! zo
15
normal! zo
45
normal! zo
46
normal! zo
49
normal! zo
49
normal! zo
49
normal! zo
49
normal! zo
49
normal! zo
let s:l = 43 - ((32 * winheight(0) + 22) / 45)
if s:l < 1 | let s:l = 1 | endif
exe s:l
normal! zt
43
normal! 014|
wincmd w
argglobal
if bufexists("html/index.html") | buffer html/index.html | else | edit html/index.html | endif
setlocal fdm=indent
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=6
setlocal fml=1
setlocal fdn=20
setlocal fen
3
normal! zo
4
normal! zo
13
normal! zo
17
normal! zo
56
normal! zo
57
normal! zo
64
normal! zo
64
normal! zo
64
normal! zo
65
normal! zo
let s:l = 37 - ((36 * winheight(0) + 22) / 44)
if s:l < 1 | let s:l = 1 | endif
exe s:l
normal! zt
37
normal! 0
wincmd w
6wincmd w
exe '1resize ' . ((&lines * 22 + 47) / 94)
exe 'vert 1resize ' . ((&columns * 92 + 182) / 364)
exe '2resize ' . ((&lines * 22 + 47) / 94)
exe 'vert 2resize ' . ((&columns * 92 + 182) / 364)
exe '3resize ' . ((&lines * 22 + 47) / 94)
exe 'vert 3resize ' . ((&columns * 92 + 182) / 364)
exe '4resize ' . ((&lines * 21 + 47) / 94)
exe 'vert 4resize ' . ((&columns * 92 + 182) / 364)
exe '5resize ' . ((&lines * 44 + 47) / 94)
exe 'vert 5resize ' . ((&columns * 84 + 182) / 364)
exe '6resize ' . ((&lines * 45 + 47) / 94)
exe 'vert 6resize ' . ((&columns * 84 + 182) / 364)
exe '7resize ' . ((&lines * 45 + 47) / 94)
exe 'vert 7resize ' . ((&columns * 93 + 182) / 364)
exe '8resize ' . ((&lines * 44 + 47) / 94)
exe 'vert 8resize ' . ((&columns * 93 + 182) / 364)
exe '9resize ' . ((&lines * 45 + 47) / 94)
exe 'vert 9resize ' . ((&columns * 92 + 182) / 364)
exe '10resize ' . ((&lines * 44 + 47) / 94)
exe 'vert 10resize ' . ((&columns * 92 + 182) / 364)
tabnext 1
badd +1 index.js
badd +1 ~/cursus/app/index.js
badd +16 routes/main.js
badd +22 routes/torrent.js
badd +1 class/bittorrent.js
badd +8 class/bencode.js
badd +1 static/js/app.js
badd +1 html/index.html
badd +8 routes/api.js
badd +1 routes/login.js
badd +1 class/ninja.js
badd +3 class/db.js
badd +17 class/bencoding.js
badd +9277 t
badd +44 class/bittorrent_reader.js
if exists('s:wipebuf') && len(win_findbuf(s:wipebuf)) == 0
  silent exe 'bwipe ' . s:wipebuf
endif
unlet! s:wipebuf
set winheight=5 winwidth=84 shortmess=filnxtToO
set winminheight=1 winminwidth=10
let s:sx = expand("<sfile>:p:r")."x.vim"
if file_readable(s:sx)
  exe "source " . fnameescape(s:sx)
endif
let &so = s:so_save | let &siso = s:siso_save
doautoall SessionLoadPost
unlet SessionLoad
" vim: set ft=vim :
