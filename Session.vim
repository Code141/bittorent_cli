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
2wincmd k
wincmd w
wincmd w
wincmd w
wincmd _ | wincmd |
split
1wincmd k
wincmd w
wincmd w
wincmd w
wincmd t
set winminheight=0
set winheight=1
set winminwidth=0
set winwidth=1
exe '1resize ' . ((&lines * 1 + 40) / 80)
exe 'vert 1resize ' . ((&columns * 84 + 134) / 268)
exe '2resize ' . ((&lines * 9 + 40) / 80)
exe 'vert 2resize ' . ((&columns * 84 + 134) / 268)
exe '3resize ' . ((&lines * 64 + 40) / 80)
exe 'vert 3resize ' . ((&columns * 84 + 134) / 268)
exe '4resize ' . ((&lines * 1 + 40) / 80)
exe 'vert 4resize ' . ((&columns * 84 + 134) / 268)
exe '5resize ' . ((&lines * 74 + 40) / 80)
exe 'vert 5resize ' . ((&columns * 84 + 134) / 268)
exe 'vert 6resize ' . ((&columns * 84 + 134) / 268)
exe 'vert 7resize ' . ((&columns * 13 + 134) / 268)
argglobal
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
let s:l = 12 - ((0 * winheight(0) + 0) / 1)
if s:l < 1 | let s:l = 1 | endif
exe s:l
normal! zt
12
normal! 047|
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
let s:l = 65 - ((8 * winheight(0) + 4) / 9)
if s:l < 1 | let s:l = 1 | endif
exe s:l
normal! zt
65
normal! 0
wincmd w
argglobal
if bufexists("class/bitfield.js") | buffer class/bitfield.js | else | edit class/bitfield.js | endif
setlocal fdm=indent
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=3
setlocal fml=1
setlocal fdn=20
setlocal fen
3
normal! zo
49
normal! zo
let s:l = 47 - ((41 * winheight(0) + 32) / 64)
if s:l < 1 | let s:l = 1 | endif
exe s:l
normal! zt
47
normal! 014|
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
18
normal! zo
20
normal! zo
25
normal! zo
32
normal! zo
34
normal! zo
49
normal! zo
51
normal! zo
53
normal! zo
84
normal! zo
88
normal! zo
103
normal! zo
124
normal! zo
130
normal! zo
132
normal! zo
let s:l = 123 - ((0 * winheight(0) + 0) / 1)
if s:l < 1 | let s:l = 1 | endif
exe s:l
normal! zt
123
normal! 05|
wincmd w
argglobal
if bufexists("t") | buffer t | else | edit t | endif
setlocal fdm=indent
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=0
setlocal fml=1
setlocal fdn=20
setlocal fen
17
normal! zo
34
normal! zo
let s:l = 39 - ((38 * winheight(0) + 37) / 74)
if s:l < 1 | let s:l = 1 | endif
exe s:l
normal! zt
39
normal! 0
wincmd w
argglobal
if bufexists("class/torrent.js") | buffer class/torrent.js | else | edit class/torrent.js | endif
setlocal fdm=indent
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=9
setlocal fml=1
setlocal fdn=20
setlocal fen
32
normal! zo
65
normal! zo
84
normal! zo
184
normal! zo
192
normal! zo
193
normal! zo
193
normal! zo
216
normal! zo
217
normal! zo
224
normal! zo
239
normal! zo
286
normal! zo
332
normal! zo
333
normal! zo
340
normal! zo
354
normal! zo
let s:l = 209 - ((7 * winheight(0) + 38) / 76)
if s:l < 1 | let s:l = 1 | endif
exe s:l
normal! zt
209
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
10
normal! zo
30
normal! zo
40
normal! zo
44
normal! zo
58
normal! zo
69
normal! zo
143
normal! zo
155
normal! zo
159
normal! zo
212
normal! zo
let s:l = 22 - ((21 * winheight(0) + 38) / 76)
if s:l < 1 | let s:l = 1 | endif
exe s:l
normal! zt
22
normal! 0
wincmd w
5wincmd w
exe '1resize ' . ((&lines * 1 + 40) / 80)
exe 'vert 1resize ' . ((&columns * 84 + 134) / 268)
exe '2resize ' . ((&lines * 9 + 40) / 80)
exe 'vert 2resize ' . ((&columns * 84 + 134) / 268)
exe '3resize ' . ((&lines * 64 + 40) / 80)
exe 'vert 3resize ' . ((&columns * 84 + 134) / 268)
exe '4resize ' . ((&lines * 1 + 40) / 80)
exe 'vert 4resize ' . ((&columns * 84 + 134) / 268)
exe '5resize ' . ((&lines * 74 + 40) / 80)
exe 'vert 5resize ' . ((&columns * 84 + 134) / 268)
exe 'vert 6resize ' . ((&columns * 84 + 134) / 268)
exe 'vert 7resize ' . ((&columns * 13 + 134) / 268)
tabnext 1
badd +1 index.js
badd +1 ~/cursus/app/index.js
badd +131 class/bencode.js
badd +0 class/bitfield.js
badd +1 class/bittorrent.js
badd +1 class/torrent.js
badd +1 class/peer.js
badd +2 routes/torrent.js
badd +9 routes/main.js
badd +26 routes/api.js
badd +1 routes/login.js
badd +59 static/js/app.js
badd +37 html/index.html
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
doautoall SessionLoadPost
unlet SessionLoad
" vim: set ft=vim :
