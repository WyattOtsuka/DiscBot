import matplotlib as px
df = px.data.tips()
df = [9401, 313, 106, 39, 28, 20, 14, 9, 11, 0, 0, 0, 0, 0, 59]
fig = px.histogram(df, x="total_bill")
fig.show()