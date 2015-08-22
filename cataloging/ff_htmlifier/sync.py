import re

tmp = open("../crumbs/views/nibbles.ejs")
header = ""
footer = ""
headerFlag = True
footerFlag = False

for line in tmp.readlines():
    if headerFlag:
        header = header + line
    if "Actual items" in line:
        headerFlag = False
    if "End shopping items" in line:
        footerFlag = True
    if footerFlag:
        footer = footer + line

hout = open("header.ejs", "w")
hout.write(header)
hout.close()

fout = open("footer.ejs", "w")
fout.write(footer)
fout.close()
