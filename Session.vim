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
wincmd _ | wincmd |
vsplit
4wincmd h
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
exe '1resize ' . ((&lines * 41 + 47) / 94)
exe 'vert 1resize ' . ((&columns * 84 + 182) / 364)
exe '2resize ' . ((&lines * 7 + 47) / 94)
exe 'vert 2resize ' . ((&columns * 84 + 182) / 364)
exe '3resize ' . ((&lines * 34 + 47) / 94)
exe 'vert 3resize ' . ((&columns * 84 + 182) / 364)
exe '4resize ' . ((&lines * 5 + 47) / 94)
exe 'vert 4resize ' . ((&columns * 84 + 182) / 364)
exe '5resize ' . ((&lines * 50 + 47) / 94)
exe 'vert 5resize ' . ((&columns * 84 + 182) / 364)
exe '6resize ' . ((&lines * 39 + 47) / 94)
exe 'vert 6resize ' . ((&columns * 84 + 182) / 364)
exe '7resize ' . ((&lines * 80 + 47) / 94)
exe 'vert 7resize ' . ((&columns * 84 + 182) / 364)
exe '8resize ' . ((&lines * 9 + 47) / 94)
exe 'vert 8resize ' . ((&columns * 84 + 182) / 364)
exe 'vert 9resize ' . ((&columns * 24 + 182) / 364)
exe '10resize ' . ((&lines * 47 + 47) / 94)
exe 'vert 10resize ' . ((&columns * 84 + 182) / 364)
exe '11resize ' . ((&lines * 42 + 47) / 94)
exe 'vert 11resize ' . ((&columns * 84 + 182) / 364)
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
34
normal! zo
36
normal! zo
37
normal! zo
let s:l = 27 - ((25 * winheight(0) + 20) / 41)
if s:l < 1 | let s:l = 1 | endif
exe s:l
normal! zt
27
let s:c = 60 - ((26 * winwidth(0) + 42) / 84)
if s:c > 0
  exe 'normal! ' . s:c . '|zs' . 60 . '|'
else
  normal! 060|
endif
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
4
normal! zo
let s:l = 16 - ((6 * winheight(0) + 3) / 7)
if s:l < 1 | let s:l = 1 | endif
exe s:l
normal! zt
16
normal! 0
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
let s:l = 26 - ((24 * winheight(0) + 17) / 34)
if s:l < 1 | let s:l = 1 | endif
exe s:l
normal! zt
26
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
5
normal! zo
let s:l = 1 - ((0 * winheight(0) + 2) / 5)
if s:l < 1 | let s:l = 1 | endif
exe s:l
normal! zt
1
normal! 0
wincmd w
argglobal
if bufexists("routes/torrent.js") | buffer routes/torrent.js | else | edit routes/torrent.js | endif
setlocal fdm=indent
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=5
setlocal fml=1
setlocal fdn=20
setlocal fen
12
normal! zo
14
normal! zo
15
normal! zo
let s:l = 34 - ((33 * winheight(0) + 25) / 50)
if s:l < 1 | let s:l = 1 | endif
exe s:l
normal! zt
34
normal! 015|
wincmd w
argglobal
if bufexists("class/bencode.js") | buffer class/bencode.js | else | edit class/bencode.js | endif
setlocal fdm=indent
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=5
setlocal fml=1
setlocal fdn=20
setlocal fen
3
normal! zo
5
normal! zo
15
normal! zo
52
normal! zo
69
normal! zo
118
normal! zo
119
normal! zo
126
normal! zo
135
normal! zo
let s:l = 131 - ((19 * winheight(0) + 19) / 39)
if s:l < 1 | let s:l = 1 | endif
exe s:l
normal! zt
131
normal! 0
wincmd w
argglobal
if bufexists("class/bittorrent.js") | buffer class/bittorrent.js | else | edit class/bittorrent.js | endif
setlocal fdm=indent
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=7
setlocal fml=1
setlocal fdn=20
setlocal fen
11
normal! zo
13
normal! zo
22
normal! zo
27
normal! zo
34
normal! zo
65
normal! zo
65
normal! zo
73
normal! zo
80
normal! zo
86
normal! zo
96
normal! zo
105
normal! zo
118
normal! zo
136
normal! zo
137
normal! zo
139
normal! zo
143
normal! zo
161
normal! zo
162
normal! zo
181
normal! zo
201
normal! zo
let s:l = 29 - ((28 * winheight(0) + 40) / 80)
if s:l < 1 | let s:l = 1 | endif
exe s:l
normal! zt
29
normal! 031|
wincmd w
argglobal
terminal ++curwin ++cols=84 ++rows=9 
setlocal fdm=indent
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=0
setlocal fml=1
setlocal fdn=20
setlocal fen
let s:l = 1 - ((0 * winheight(0) + 4) / 9)
if s:l < 1 | let s:l = 1 | endif
exe s:l
normal! zt
1
normal! 0
wincmd w
argglobal
if bufexists("class/peer.js") | buffer class/peer.js | else | edit class/peer.js | endif
setlocal fdm=indent
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=3
setlocal fml=1
setlocal fdn=20
setlocal fen
6
normal! zo
8
normal! zo
13
normal! zo
16
normal! zo
29
normal! zo
44
normal! zo
57
normal! zo
59
normal! zo
75
normal! zo
86
normal! zo
138
normal! zo
150
normal! zo
161
normal! zo
209
normal! zc
221
normal! zo
let s:l = 30 - ((29 * winheight(0) + 45) / 90)
if s:l < 1 | let s:l = 1 | endif
exe s:l
normal! zt
30
let s:c = 5 - ((0 * winwidth(0) + 12) / 24)
if s:c > 0
  exe 'normal! ' . s:c . '|zs' . 5 . '|'
else
  normal! 05|
endif
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
55
normal! zo
56
normal! zo
57
normal! zo
80
normal! zo
80
normal! zo
95
normal! zo
102
normal! zo
let s:l = 59 - ((27 * winheight(0) + 23) / 47)
if s:l < 1 | let s:l = 1 | endif
exe s:l
normal! zt
59
normal! 013|
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
let s:l = 37 - ((34 * winheight(0) + 21) / 42)
if s:l < 1 | let s:l = 1 | endif
exe s:l
normal! zt
37
normal! 0
wincmd w
5wincmd w
exe '1resize ' . ((&lines * 41 + 47) / 94)
exe 'vert 1resize ' . ((&columns * 84 + 182) / 364)
exe '2resize ' . ((&lines * 7 + 47) / 94)
exe 'vert 2resize ' . ((&columns * 84 + 182) / 364)
exe '3resize ' . ((&lines * 34 + 47) / 94)
exe 'vert 3resize ' . ((&columns * 84 + 182) / 364)
exe '4resize ' . ((&lines * 5 + 47) / 94)
exe 'vert 4resize ' . ((&columns * 84 + 182) / 364)
exe '5resize ' . ((&lines * 50 + 47) / 94)
exe 'vert 5resize ' . ((&columns * 84 + 182) / 364)
exe '6resize ' . ((&lines * 39 + 47) / 94)
exe 'vert 6resize ' . ((&columns * 84 + 182) / 364)
exe '7resize ' . ((&lines * 80 + 47) / 94)
exe 'vert 7resize ' . ((&columns * 84 + 182) / 364)
exe '8resize ' . ((&lines * 9 + 47) / 94)
exe 'vert 8resize ' . ((&columns * 84 + 182) / 364)
exe 'vert 9resize ' . ((&columns * 24 + 182) / 364)
exe '10resize ' . ((&lines * 47 + 47) / 94)
exe 'vert 10resize ' . ((&columns * 84 + 182) / 364)
exe '11resize ' . ((&lines * 42 + 47) / 94)
exe 'vert 11resize ' . ((&columns * 84 + 182) / 364)
tabnext 1
badd +1 index.js
badd +1 ~/cursus/app/index.js
badd +16 routes/main.js
badd +8 routes/api.js
badd +1 routes/login.js
badd +22 routes/torrent.js
badd +1 class/bencode.js
badd +0 class/bittorrent.js
badd +1 class/peer.js
badd +1 static/js/app.js
badd +1 html/index.html
badd +1 class/ninja.js
badd +3 class/db.js
badd +17 class/bencoding.js
badd +9277 t
badd +44 class/bittorrent_reader.js
badd +4 class/seeder.js
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
nohlsearch
doautoall SessionLoadPost
unlet SessionLoad
" vim: set ft=vim :
