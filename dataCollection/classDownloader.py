import requests

#Downloads all Spring 2024 classes and merges into one file

termNumber = 2244


endPoint = "https://pitcsprd.csps.pitt.edu/psc/pitcsprd/EMPLOYEE/SA/s/WEBLIB_HCX_CM.H_CLASS_SEARCH.FieldFormula.IScript_ClassSearch?institution=UPITT&term=2244&date_from=&date_thru=&subject=&subject_like=&catalog_nbr=&time_range=&days=&campus=PIT&location=&x_acad_career=UGRD&acad_group=&rqmnt_designtn=&instruction_mode=&keyword=&class_nbr=&acad_org=&enrl_stat=&crse_attr=&crse_attr_value=&instructor_name=&session_code=&units=&page="

#start at page 1
page = 1

with open('/dump/dump.txt', 'x') as file:
        while True:
                print("Page #:",page)

                curUrl = endPoint + str(page)
                r = requests.get(url=curUrl)

                #break loop if we reached the end of the pages and there is no more content
                if(len(r.content) <= 2):
                        break
        
                rText = r.text[1:][:-1]

                file.write(rText)

                page += 1