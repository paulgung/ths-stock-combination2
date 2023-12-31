import {
  addStockCombination,
  deleteStockCombination,
  getCombinationData,
  updateStockCombination,
} from '@/services/ths';
import { ModalForm, ProFormText } from '@ant-design/pro-components';
import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import { ProTable } from '@ant-design/pro-table';
import { Button, message } from 'antd';
import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // version 5.2.0

type IInterface = {
  id: number;
  combinationName: string;
};

const Index: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const navigate = useNavigate();
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  const [deleteModalOpen, handleDeleteModalOpen] = useState<boolean>(false);
  const [currentEditRow, setCurrentEditRow] = useState<any>({});
  const [deleteRecord, setDeleteRecord] = useState<any>({}); // 设置要删除的组合
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // 携带父组合id跳转子组合
  const jumpSubCombination = (id: number): void => {
    navigate(`/ths/subcombination/${id}`);
  };
  const columns: ProColumns<IInterface>[] = [
    {
      title: '组合ID',
      hideInSearch: true,
      dataIndex: 'id',
    },
    {
      title: '组合名称',
      ellipsis: true,
      dataIndex: 'combinationName',
      hideInSearch: true,
      render: (item, record: any) => {
        return (
          <div
            style={{ color: 'blue', cursor: 'pointer' }}
            onClick={() => jumpSubCombination(record?.id)}
          >
            {item}
          </div>
        );
      },
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      render: (text, record) => [
        <a
          key="editable"
          onClick={() => {
            setCurrentEditRow(record);
            handleModalOpen(true);
            setIsEditing(true);
          }}
        >
          编辑
        </a>,
        <a
          key="editState"
          onClick={() => {
            handleDeleteModalOpen(true);
            setDeleteRecord(record);
          }}
        >
          删除
        </a>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<IInterface>
        headerTitle="组合信息"
        columns={columns}
        actionRef={actionRef}
        cardBordered
        search={false}
        request={async (search) => {
          const { rows = 10, current, id, combinationName } = search;

          return getCombinationData({
            pageSize: rows,
            pageNo: current,
            id,
            combinationName,
          }).then(
            // 返回数据
            (res: any) => {
              return {
                data: res.data?.data,
                success: res.data?.success,
                total: res.data?.total,
              };
            },
            // 失败处理
            (): any => {
              message.error('网络请求失败！');
              return {
                data: [],
                success: false,
                total: 0,
              };
            },
          );
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleModalOpen(true);
              setIsEditing(false);
            }}
          >
            新增
          </Button>,
        ]}
        editable={{
          type: 'multiple',
        }}
        rowKey="id"
        options={{
          setting: {
            listsHeight: 400,
          },
        }}
        pagination={{
          pageSize: 10,
        }}
        dateFormatter="string"
      />

      {/* 弹框 */}
      <ModalForm
        labelCol={{ span: 4 }}
        title={isEditing ? '编辑组合' : '新增组合'}
        initialValues={currentEditRow}
        layout={'horizontal'}
        width="500px"
        open={createModalOpen}
        onOpenChange={handleModalOpen}
        onFinish={async (value) => {
          const success = (await isEditing)
            ? updateStockCombination({ ...value, id: currentEditRow.id })
            : addStockCombination(value);
          if (success) {
            handleModalOpen(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
      >
        <ProFormText
          rules={[
            {
              required: true,
            },
          ]}
          label="组合名称"
          width="md"
          name="combinationName"
        />
      </ModalForm>

      {/* 删除弹框 */}
      <ModalForm
        labelCol={{ span: 4 }}
        title="删除组合"
        layout={'horizontal'}
        width="500px"
        open={deleteModalOpen}
        onOpenChange={handleDeleteModalOpen}
        onFinish={async () => {
          const success = await deleteStockCombination({ id: deleteRecord.id });
          if (success) {
            handleDeleteModalOpen(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
      >
        <div>你确定要删除该组合吗？</div>
      </ModalForm>
    </PageContainer>
  );
};
export default Index;
