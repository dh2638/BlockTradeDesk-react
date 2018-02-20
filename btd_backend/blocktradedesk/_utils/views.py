from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from rest_framework import status
from rest_framework.response import Response


class AjaxResponse(object):
    def invalid_serializer(self, serializer):
        errors = {}
        for key, value in serializer.errors.items():
            errors[key] = value[0]
        errors.update({'status': False})
        return Response(errors, status=status.HTTP_400_BAD_REQUEST)

    def valid_serializer(self, data):
        data.update({'status': True})
        return Response(data, status=status.HTTP_201_CREATED)

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data, context={'request': request})
        if serializer.is_valid():
            return self.valid_serializer({'message': self.message})
        else:
            return self.invalid_serializer(serializer)

class LoginRequiredMixin(object):
    @method_decorator(login_required)
    def dispatch(self, *args, **kwargs):
        return super(LoginRequiredMixin, self).dispatch(*args, **kwargs)


def groupby_queryset_with_fields(queryset, fields):
    fields_qs = {}
    from itertools import groupby

    for field in fields:
        queryset = queryset.order_by(field)

        def getter(obj):
            related_names = field.split('__')
            for related_name in related_names:
                try:
                    obj = getattr(obj, related_name)
                except AttributeError:
                    obj = None
            return obj

        fields_qs[field] = [{'grouper': key, 'list': list(group)} for key, group in
                            groupby(queryset, lambda x: getattr(x, field)
                            if '__' not in field else getter(x))]
    return fields_qs
