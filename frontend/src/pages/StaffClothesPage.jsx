import { useCallback, useEffect, useState } from "react";
import * as clothesApi from "../api/clothesApi";
import { Modal } from "../components/Modal";
import { formatVnd } from "../utils/formatVnd";

const empty = {
  name: "",
  brand: "",
  category: "Áo",
  gender: "Unisex",
  size: "M",
  color: "",
  material: "",
  price: "",
  stock: 0,
  image_url: "",
  description: "",
};

export default function StaffClothesPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(empty);
  const [receive, setReceive] = useState({ id: null, delta: 5 });

  const load = useCallback(async () => {
    setLoading(true);
    setErr("");
    try {
      const data = await clothesApi.getAll({ limit: 100 });
      setRows(data?.results ?? data ?? []);
    } catch (e) {
      setErr(e?.response?.data?.detail || e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function openCreate() {
    setForm(empty);
    setModal("create");
  }

  function openEdit(p) {
    setForm({
      name: p.name,
      brand: p.brand,
      category: p.category,
      gender: p.gender,
      size: p.size,
      color: p.color,
      material: p.material,
      price: p.price,
      stock: p.stock,
      image_url: p.image_url || "",
      description: p.description || "",
    });
    setModal(`edit:${p.id}`);
  }

  async function saveCreate(e) {
    e.preventDefault();
    await clothesApi.create({
      ...form,
      stock: Number(form.stock),
      price: form.price,
    });
    setModal(null);
    load();
  }

  async function saveEdit(e) {
    e.preventDefault();
    const id = modal.split(":")[1];
    await clothesApi.update(id, {
      ...form,
      stock: Number(form.stock),
      price: form.price,
    });
    setModal(null);
    load();
  }

  async function doRemove(p) {
    if (!confirm(`Xóa sản phẩm "${p.name}"?`)) return;
    await clothesApi.remove(p.id);
    load();
  }

  async function doReceive() {
    if (!receive.id) return;
    await clothesApi.receiveStock(receive.id, Number(receive.delta));
    setReceive({ id: null, delta: 5 });
    load();
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Quản lý quần áo &amp; nhập kho
          </h1>
          <p className="text-sm text-slate-500">
            Thêm / sửa / nhập tồn / xóa — API cổng 8008 (PostgreSQL)
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700"
        >
          + Thêm quần áo
        </button>
      </header>
      {err ? (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800">
          {err}
        </p>
      ) : null}
      {loading ? (
        <p className="text-slate-500">Đang tải…</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
            <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-600">
              <tr>
                <th className="px-3 py-2">Tên</th>
                <th className="px-3 py-2">Danh mục</th>
                <th className="px-3 py-2">Tồn</th>
                <th className="px-3 py-2">Giá</th>
                <th className="px-3 py-2 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50">
                  <td className="px-3 py-2 font-medium text-slate-900">
                    {p.name}
                  </td>
                  <td className="px-3 py-2 text-slate-600">
                    {p.category} · {p.gender}
                  </td>
                  <td className="px-3 py-2">{p.stock}</td>
                  <td className="px-3 py-2">{formatVnd(p.price)}</td>
                  <td className="space-x-2 whitespace-nowrap px-3 py-2 text-right">
                    <button
                      type="button"
                      onClick={() => setReceive({ id: p.id, delta: 5 })}
                      className="rounded bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-900"
                    >
                      Nhập kho
                    </button>
                    <button
                      type="button"
                      onClick={() => openEdit(p)}
                      className="rounded bg-rose-100 px-2 py-1 text-xs font-medium text-rose-900"
                    >
                      Sửa
                    </button>
                    <button
                      type="button"
                      onClick={() => doRemove(p)}
                      className="rounded bg-red-100 px-2 py-1 text-xs font-medium text-red-900"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        title="Nhập thêm tồn kho"
        open={!!receive.id}
        onClose={() => setReceive({ id: null, delta: 5 })}
      >
        <input
          type="number"
          value={receive.delta}
          onChange={(e) =>
            setReceive((r) => ({ ...r, delta: e.target.value }))
          }
          className="mb-4 w-full rounded-lg border border-slate-300 px-3 py-2"
        />
        <button
          type="button"
          onClick={doReceive}
          className="w-full rounded-lg bg-emerald-600 py-2 text-white hover:bg-emerald-700"
        >
          Cập nhật tồn
        </button>
      </Modal>

      <Modal
        title={modal?.startsWith("edit") ? "Sửa quần áo" : "Thêm quần áo"}
        open={modal === "create" || modal?.startsWith("edit")}
        onClose={() => setModal(null)}
      >
        <form
          onSubmit={modal === "create" ? saveCreate : saveEdit}
          className="max-h-[70vh] space-y-2 overflow-y-auto text-sm"
        >
          {[
            "name",
            "brand",
            "category",
            "material",
            "color",
            "size",
            "image_url",
          ].map((k) => (
            <label key={k} className="block">
              <span className="text-slate-600">{k}</span>
              <input
                value={form[k] ?? ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, [k]: e.target.value }))
                }
                className="mt-0.5 w-full rounded border border-slate-300 px-2 py-1"
              />
            </label>
          ))}
          <label className="block">
            <span className="text-slate-600">gender</span>
            <select
              value={form.gender}
              onChange={(e) =>
                setForm((f) => ({ ...f, gender: e.target.value }))
              }
              className="mt-0.5 w-full rounded border border-slate-300 px-2 py-1"
            >
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
              <option value="Unisex">Unisex</option>
            </select>
          </label>
          <label className="block">
            <span className="text-slate-600">stock</span>
            <input
              type="number"
              value={form.stock}
              onChange={(e) =>
                setForm((f) => ({ ...f, stock: e.target.value }))
              }
              className="mt-0.5 w-full rounded border border-slate-300 px-2 py-1"
            />
          </label>
          <label className="block">
            <span className="text-slate-600">price</span>
            <input
              value={form.price}
              onChange={(e) =>
                setForm((f) => ({ ...f, price: e.target.value }))
              }
              className="mt-0.5 w-full rounded border border-slate-300 px-2 py-1"
            />
          </label>
          <label className="block">
            <span className="text-slate-600">description</span>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              className="mt-0.5 w-full rounded border border-slate-300 px-2 py-1"
              rows={2}
            />
          </label>
          <button
            type="submit"
            className="w-full rounded-lg bg-rose-600 py-2 text-white hover:bg-rose-700"
          >
            Lưu
          </button>
        </form>
      </Modal>
    </div>
  );
}
