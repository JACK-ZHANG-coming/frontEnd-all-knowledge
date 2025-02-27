# msg = 'hello,python!'
# print(msg)

# a=1
# print(a)   # output: 1

# str1 = "Hello, World!"
# print('str:',str1)
# str1 = str1 + " How are you?"
# print('str:',str1)

# # 列表
# list = [1,2,3,4]
# print('list:',list)
# list[0] = 'x'
# print('list:',list)

# # 元组
# tuple = ( 'abcd', 786 , 2.23, 'runoob', 70.2  )
# print('tuple:',tuple)

# # 集合
# set = { 'abcd', 786 , 2.23, 'runoob', 70.2,'runoob'  }
# print('set:',set)

# # 字典
# dict = {}
# dict['one'] = "This is one"
# dict[2]     = "This is two"
# tinydict = {'name': 'runoob','code':1, 'site': 'www.runoob.com'}
# print('dict:',dict)
# print('tinydict:',tinydict)

# 列表推导式
# 语法： [expression for item in iterable if condition]
# 例子：
# 过滤掉长度小于或等于3的字符串列表，并将剩下的转换成大写字母
# names = ['Bob','Tom','alice','Jerry','Wendy','Smith']
# new_names = [name.upper() for name in names if len(name)>3]
# print(new_names)

# # 字典推导式
# # 语法： {key_expression:value_expression for item in iterable if condition}
# # 例子：
# # 字典中只保留偶数索引的元素，并将偶数索引的元素值转换成字符格式
# def format_num(num):
#     return str(num)
# numbers = [1,2,3,4,5,6,7,8,9]
# new_numbers = {i:format_num(numbers[i]) for i in range(0,len(numbers),2)}
# print(new_numbers)

print(__name__)