## Вот так примерно выглядит POST запрос на создание товара

```json
[
  {
    "priority": 0,
    "dated": 1755432759,
    "operation": "Заказ",
    "tax_included": true,
    "tax_active": true,
    "goods": [
      {
        "price": 500,
        "quantity": 1,
        "unit": 116,
        "discount": 0,
        "sum_discounted": 0,
        "nomenclature": 46130
      }
    ],
    "settings": {},
    "loyality_card_id": 23176,
    "warehouse": 39,
    "contragent": 70708,
    "paybox": 812,
    "organization": 204,
    "status": true,
    "paid_rubles": 495,
    "paid_lt": 5,
    "sum": 500
  }
]
```

## Это возращенное значение от поиска контрагентов

```json
{
  "count": 1,
  "result": [
    {
      "id": 297724,
      "name": "Test123456",
      "external_id": null,
      "phone": "71231231232",
      "phone_code": "",
      "inn": null,
      "description": null,
      "contragent_type": null,
      "type": null,
      "birth_date": null,
      "data": null,
      "additional_phones": null,
      "gender": null,
      "cashbox": 113,
      "is_deleted": false,
      "is_phone_formatted": false,
      "created_at": 1741010918,
      "updated_at": 1741010918,
      "email": null
    }
  ]
}
```

## Это то, как возвращаются значения выбора счета зачисления

Поиск склада

```json
{
  "result": [
    {
      "id": 812,
      "external_id": null,
      "name": "рыбалка",
      "start_balance": 0,
      "balance": 6979.2,
      "balance_date": 1755043200,
      "created_at": 1755090690,
      "update_start_balance": 1755432762,
      "update_start_balance_date": 1755090690,
      "organization_id": null,
      "updated_at": 1755090690
    },
    {
      "id": 759,
      "external_id": null,
      "name": "Второй",
      "start_balance": 0,
      "balance": 8932.8,
      "balance_date": 1752537600,
      "created_at": 1752595301,
      "update_start_balance": 1755432762,
      "update_start_balance_date": 1752595301,
      "organization_id": null,
      "updated_at": 1752595301
    },
    {
      "id": 758,
      "external_id": null,
      "name": "Первый",
      "start_balance": 0,
      "balance": 7575.14,
      "balance_date": 1752537600,
      "created_at": 1752595293,
      "update_start_balance": 1755432762,
      "update_start_balance_date": 1752595293,
      "organization_id": null,
      "updated_at": 1752595293
    }
  ],
  "count": 3
}
```

## Поиск склада

```json
[
  {
    "name": "1111",
    "type": null,
    "description": null,
    "address": null,
    "phone": null,
    "parent": null,
    "status": true,
    "id": 50,
    "updated_at": 1710100223,
    "created_at": 1709755001
  },
  {
    "name": "Склад 1",
    "type": "Склад",
    "description": "Склад 1",
    "address": null,
    "phone": null,
    "parent": null,
    "status": true,
    "id": 69,
    "updated_at": 1719407280,
    "created_at": 1719407280
  }
]
```

## Поиск организации

```json
[
  {
    "type": "test",
    "short_name": "test",
    "full_name": null,
    "work_name": null,
    "prefix": null,
    "inn": null,
    "kpp": null,
    "okved": null,
    "okved2": null,
    "okpo": null,
    "ogrn": null,
    "org_type": "ООО",
    "tax_type": null,
    "tax_percent": null,
    "registration_date": 1708887232,
    "id": 43,
    "updated_at": 1708887232,
    "created_at": 1708887232
  },
  {
    "type": "test",
    "short_name": "asd",
    "full_name": null,
    "work_name": null,
    "prefix": null,
    "inn": null,
    "kpp": null,
    "okved": null,
    "okved2": null,
    "okpo": null,
    "ogrn": null,
    "org_type": "ООО",
    "tax_type": null,
    "tax_percent": null,
    "registration_date": 1708887329,
    "id": 45,
    "updated_at": 1708887329,
    "created_at": 1708887329
  },
  {
    "type": "test1",
    "short_name": "test1",
    "full_name": "test1",
    "work_name": "test1",
    "prefix": "test1",
    "inn": null,
    "kpp": null,
    "okved": null,
    "okved2": null,
    "okpo": null,
    "ogrn": null,
    "org_type": null,
    "tax_type": null,
    "tax_percent": null,
    "registration_date": 1706899398,
    "id": 46,
    "updated_at": 1709059414,
    "created_at": 1709059414
  }
]
```

## Тип цены

```json
{
  "result": [
    {Поиск склада
      "name": "Тестовый вид цены",
      "id": 80,
      "updated_at": 1713795346,
      "created_at": 1713795346
    },
    {
      "name": "Доллары",
      "id": 165,
      "updated_at": 1753773419,
      "created_at": 1753773419
    }
  ],
  "count": 2
}
```
