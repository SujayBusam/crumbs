import os
import re

header = open("header.ejs").read()
footer = open("footer.ejs").read()

outfile = open("output.html", "w")

outfile.write(header)

outfile.write('<div id="listContainer" style="max-height:200px;overflow-y:auto">\n')
outfile.write('<ul id="expList">\n')
outfile.write(
        '''

        <li style="background-color:#FFA6AB"> Long River Artists
            <ul>
                    <li class="shoppingitem"> <span data-imgpath="mattbrown.jpg" class="shoppingitemname"> <a class="artistlink" href="https://hangaprints.com/gallery/recent/?display=grid&print_id=above_king_ravine">Matt Brown</a></span><span class="shoppingprice"></span></li>
                                <li class="shoppingitem"> <span data-imgpath="case.jpg" class="shoppingitemname"> <a class="artistlink" href="http://theuppervalley.com/events/art-and-jewelry-openingwine-tasting-at-long-river-studios-gallery-gifts-lyme-nh/">Case Hathaway-Zepeda '09</a> </span></li>
                                            <li class="shoppingitem"> <span data-imgpath="lynn.jpg" class="shoppingitemname"> <a class="artistlink" href="http://www.lynnadams-metalsmith.com">Lynn Adams</a> </span></li>
                                                        <li class="shoppingitem"> <span data-imgpath="sandra.jpg" class="shoppingitemname"> <a class="artistlink" href="http://sandrabomhowerjewelry.com">Sandra Bomhower</a> </span></li>
                                                                    <li class="shoppingitem"> <span data-imgpath="isobel.jpg" class="shoppingitemname"> <a class="artistlink" href="http://www.isobelcochran.com">Isobel Cochran</a> </span></li>
                                                                                <li class="shoppingitem"> <span data-imgpath="micki.jpg" class="shoppingitemname"> <a class="artistlink" href="http://www.megmclean.com">Meg Maclean</a> </span></li>
                                                                                            <li class="shoppingitem"> <span data-imgpath="keita.jpg" class="shoppingitemname"> <a class="artistlink" href="http://www.keitacolton.com/">Keita Colton</a> </span></li>


                                                                                                    </ul>
                                                                                                        </li>
        ''')

itemtypes = os.listdir("example")
itemtypes.sort()

for itemtype in itemtypes:
        if "Produce" in itemtype:
            outfile.write('<li style="color:green">' + itemtype.capitalize() + "\n")
        else:
            outfile.write("<li> " + itemtype.capitalize() + "\n")
	outfile.write("<ul>\n")
        itemtype_clean = re.sub(" ", "", itemtype.lower())
        itemtype_html = re.sub(" ", "%20", itemtype)
	items = open("example/" + itemtype + "/items.txt").read().split("\n")
        items = map(lambda s: s.split(";"), items)
        items = filter(lambda s: len(s) == 3, items)
        items.sort(key=lambda s: s[1])
	for item_spl in items:
		id = "example/" + itemtype_html + "/" + item_spl[0] + ".jpg"
		name = item_spl[1].capitalize()
                price = "$" + "{0:.2f}".format(float(item_spl[2]) * 1.10)
		li = '<li class="shoppingitem">'
		li = li + ' <span data-imgpath="' + id + '" class="shoppingitemname"> ' + name + '</span>'
		li = li + ' <span class="shoppingprice">' + price + '</span>'
		li = li + ' <input class="shoppingquantity" type="text" placeholder="Qty" /></li>'
		outfile.write(li + "\n")
	outfile.write("</ul>\n")
	outfile.write("</li>\n")

outfile.write('</ul>\n')
outfile.write('</div>\n')
outfile.write(footer)
outfile.close()
