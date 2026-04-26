import undetected_chromedriver as uc
import time

driver = uc.Chrome(version_main=146)

driver.get("https://vsembed.ru/embed/movie?imdb=tt33014583")

time.sleep(8)

print("CURRENT URL:", driver.current_url)
print("TITLE:", driver.title)

print("\nPAGE SOURCE PREVIEW:\n")
print(driver.page_source[:500])

input("Press Enter to close...")
try:
    driver.quit()
except:
    pass    
