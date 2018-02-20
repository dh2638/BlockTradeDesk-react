from rest_framework.pagination import PageNumberPagination


class QueryLenPagination(PageNumberPagination):
    page_size = 10000
    page_size_query_param = 'count'
    max_page_size = 10000
