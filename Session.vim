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
wincmd w
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
wincmd _ | wincmd |
split
1wincmd k
wincmd w
wincmd t
set winminheight=0
set winheight=1
set winminwidth=0
set winwidth=1
exe 'vert 1resize ' . ((&columns * 84 + 182) / 364)
exe '2resize ' . ((&lines * 29 + 47) / 94)
exe 'vert 2resize ' . ((&columns * 92 + 182) / 364)
exe '3resize ' . ((&lines * 30 + 47) / 94)
exe 'vert 3resize ' . ((&columns * 92 + 182) / 364)
exe '4resize ' . ((&lines * 29 + 47) / 94)
exe 'vert 4resize ' . ((&columns * 92 + 182) / 364)
exe '5resize ' . ((&lines * 45 + 47) / 94)
exe 'vert 5resize ' . ((&columns * 93 + 182) / 364)
exe '6resize ' . ((&lines * 44 + 47) / 94)
exe 'vert 6resize ' . ((&columns * 93 + 182) / 364)
exe '7resize ' . ((&lines * 45 + 47) / 94)
exe 'vert 7resize ' . ((&columns * 92 + 182) / 364)
exe '8resize ' . ((&lines * 44 + 47) / 94)
exe 'vert 8resize ' . ((&columns * 92 + 182) / 364)
argglobal
setlocal fdm=indent
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=2
setlocal fml=1
setlocal fdn=20
setlocal fen
let s:l = 16 - ((15 * winheight(0) + 45) / 90)
if s:l < 1 | let s:l = 1 | endif
exe s:l
normal! zt
16
normal! 039|
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
let s:l = 1 - ((0 * winheight(0) + 14) / 29)
if s:l < 1 | let s:l = 1 | endif
exe s:l
normal! zt
1
normal! 0
lcd ~/cursus/app
wincmd w
argglobal
if bufexists("~/cursus/app/routes/api.js") | buffer ~/cursus/app/routes/api.js | else | edit ~/cursus/app/routes/api.js | endif
setlocal fdm=indent
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=3
setlocal fml=1
setlocal fdn=20
setlocal fen
let s:l = 1 - ((0 * winheight(0) + 15) / 30)
if s:l < 1 | let s:l = 1 | endif
exe s:l
normal! zt
1
normal! 0
lcd ~/cursus/app
wincmd w
argglobal
if bufexists("~/cursus/app/routes/login.js") | buffer ~/cursus/app/routes/login.js | else | edit ~/cursus/app/routes/login.js | endif
setlocal fdm=indent
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=2
setlocal fml=1
setlocal fdn=20
setlocal fen
let s:l = 1 - ((0 * winheight(0) + 14) / 29)
if s:l < 1 | let s:l = 1 | endif
exe s:l
normal! zt
1
normal! 0
lcd ~/cursus/app
wincmd w
argglobal
if bufexists("~/cursus/app/class/ninja.js") | buffer ~/cursus/app/class/ninja.js | else | edit ~/cursus/app/class/ninja.js | endif
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
5
normal! zo
let s:l = 18 - ((9 * winheight(0) + 22) / 45)
if s:l < 1 | let s:l = 1 | endif
exe s:l
normal! zt
18
normal! 09|
lcd ~/cursus/app
wincmd w
argglobal
if bufexists("~/cursus/app/class/db.js") | buffer ~/cursus/app/class/db.js | else | edit ~/cursus/app/class/db.js | endif
setlocal fdm=indent
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=5
setlocal fml=1
setlocal fdn=20
setlocal fen
let s:l = 1 - ((0 * winheight(0) + 22) / 44)
if s:l < 1 | let s:l = 1 | endif
exe s:l
normal! zt
1
normal! 0
lcd ~/cursus/app
wincmd w
argglobal
if bufexists("~/cursus/app/static/js/app.js") | buffer ~/cursus/app/static/js/app.js | else | edit ~/cursus/app/static/js/app.js | endif
setlocal fdm=indent
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=7
setlocal fml=1
setlocal fdn=20
setlocal fen
let s:l = 1 - ((0 * winheight(0) + 22) / 45)
if s:l < 1 | let s:l = 1 | endif
exe s:l
normal! zt
1
normal! 0
wincmd w
argglobal
if bufexists("~/cursus/app/html/index.html") | buffer ~/cursus/app/html/index.html | else | edit ~/cursus/app/html/index.html | endif
setlocal fdm=indent
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=6
setlocal fml=1
setlocal fdn=20
setlocal fen
let s:l = 2 - ((1 * winheight(0) + 22) / 44)
if s:l < 1 | let s:l = 1 | endif
exe s:l
normal! zt
2
normal! 0
wincmd w
4wincmd w
exe 'vert 1resize ' . ((&columns * 84 + 182) / 364)
exe '2resize ' . ((&lines * 29 + 47) / 94)
exe 'vert 2resize ' . ((&columns * 92 + 182) / 364)
exe '3resize ' . ((&lines * 30 + 47) / 94)
exe 'vert 3resize ' . ((&columns * 92 + 182) / 364)
exe '4resize ' . ((&lines * 29 + 47) / 94)
exe 'vert 4resize ' . ((&columns * 92 + 182) / 364)
exe '5resize ' . ((&lines * 45 + 47) / 94)
exe 'vert 5resize ' . ((&columns * 93 + 182) / 364)
exe '6resize ' . ((&lines * 44 + 47) / 94)
exe 'vert 6resize ' . ((&columns * 93 + 182) / 364)
exe '7resize ' . ((&lines * 45 + 47) / 94)
exe 'vert 7resize ' . ((&columns * 92 + 182) / 364)
exe '8resize ' . ((&lines * 44 + 47) / 94)
exe 'vert 8resize ' . ((&columns * 92 + 182) / 364)
tabnext 1
badd +1 ~/cursus/app/index.js
badd +0 ~/cursus/app/routes/login.js
badd +0 ~/cursus/app/routes/db.js
badd +13 ~/cursus/app/routes/api.js
badd +31 ~/cursus/app/class/db.js
badd +1 ~/cursus/app/class/ninja.js
badd +1 ~/cursus/app/static/js/app.js
badd +1 ~/cursus/app/html/index.html
badd +1 ~/cursus/app
badd +0 ~/cursus/app/routes/main.js
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
