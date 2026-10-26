/* 2D mode: bubbles and prompts follow the 2D projection */
function toScreen(x,y,z){const ps=innerWidth/R.canvas.width,px=(x*R.U+R.ox)*ps,py=((z*R.K-y*R.HH)*R.U+R.oy)*ps;return[px,py,px>-20&&px<innerWidth+20&&py>-20&&py<innerHeight+20]}
